<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de pedidos.

namespace App\Domain\Order\Services;

// Esta línea sirve para importar el catálogo de estados de un pedido.
use App\Domain\Order\OrderStatusCatalog;
// Esta línea sirve para importar el modelo Order (pedido).
use App\Models\Order;

/**
 * Arma el texto (y el link wa.me) del mensaje de WhatsApp para un pedido —
 * una plantilla por estado, pensadas para poder ajustarse acá sin tocar
 * nada del resto del flujo (Resources/Controllers solo piden el texto ya
 * armado). No manda nada por su cuenta: el superadmin sigue abriendo el
 * link y enviando el mensaje a mano — WhatsApp Business API es una fase
 * posterior (ver punto 16 del pedido de Fase 3).
 */
// Esta línea sirve para declarar el servicio que arma los mensajes de WhatsApp de un pedido.
class OrderWhatsAppMessageBuilder
{
    /** Normalizar config('app.support_whatsapp_number') es el mismo trabajo en cada fila de un listado de pedidos — se cachea una vez por instancia (que además es singleton, ver AppServiceProvider). */
    // Esta línea sirve para guardar en memoria el número de soporte ya normalizado.
    private ?string $normalizedSupportPhone = null;

    // Esta línea sirve para recordar si el número de soporte ya se calculó.
    private bool $supportPhoneResolved = false;

    /**
     * Mensaje del superadmin hacia el cliente sobre el estado de su pedido.
     */
    // Esta línea sirve para declarar el método que arma el mensaje para el cliente según el estado del pedido.
    public function buildCustomerMessage(Order $order): string
    {
        // Esta línea sirve para obtener el primer nombre del cliente.
        $name = $this->firstName($order->customer_name);
        // Esta línea sirve para obtener el número del pedido.
        $number = $order->orderNumber();

        // Esta línea sirve para elegir la plantilla según el estado del pedido.
        return match ($order->status) {
            // Esta línea sirve para usar el mensaje del estado "confirmando".
            OrderStatusCatalog::CONFIRMING => $this->confirmingTemplate($name, $number),
            // Esta línea sirve para usar el mensaje del estado "en camino".
            OrderStatusCatalog::SHIPPED => $this->shippedTemplate($name, $number, $order),
            // Esta línea sirve para usar el mensaje del estado "entregado".
            OrderStatusCatalog::DELIVERED => $this->deliveredTemplate($name, $number),
            // Esta línea sirve para usar el mensaje del estado "problema".
            OrderStatusCatalog::PROBLEM => $this->problemTemplate($name, $number, $order),
            // Esta línea sirve para usar el mensaje genérico para el resto de estados.
            default => $this->genericTemplate($name, $number, $order),
        };
    }

    /**
     * Link wa.me hacia el WhatsApp del CLIENTE, con el mensaje según estado
     * ya cargado — null si el pedido no tiene un WhatsApp utilizable.
     */
    // Esta línea sirve para declarar el método que arma el link de WhatsApp hacia el cliente.
    public function buildCustomerUrl(Order $order): ?string
    {
        // Esta línea sirve para normalizar el WhatsApp del cliente.
        $phone = $this->normalizePhone($order->customer_whatsapp);
        // Esta línea sirve para revisar si no hay un número utilizable.
        if (! $phone) {
            // Esta línea sirve para devolver null porque no se puede armar el link.
            return null;
        }

        // Esta línea sirve para devolver el link con el mensaje ya cargado.
        return $this->waMeUrl($phone, $this->buildCustomerMessage($order));
    }

    /**
     * Link wa.me hacia la línea de atención de SanKen (config('app.support_whatsapp_number'))
     * — para que el CLIENTE escriba por soporte. null si no hay número configurado.
     */
    // Esta línea sirve para declarar el método que arma el link de WhatsApp hacia la línea de soporte.
    public function buildSupportUrl(Order $order): ?string
    {
        // Esta línea sirve para obtener el número de soporte.
        $phone = $this->supportPhone();
        // Esta línea sirve para revisar si no hay número de soporte configurado.
        if (! $phone) {
            // Esta línea sirve para devolver null.
            return null;
        }

        // Esta línea sirve para armar el mensaje con el número del pedido.
        $message = "Hola SanKen 👋\n\nTengo una consulta sobre mi pedido #{$order->orderNumber()}.";

        // Esta línea sirve para devolver el link de WhatsApp con el mensaje.
        return $this->waMeUrl($phone, $message);
    }

    /**
     * config('app.support_whatsapp_number') no cambia entre pedidos — sin
     * este cache, listar 50 pedidos normalizaba (regex + substr) el mismo
     * número fijo 50 veces por request.
     */
    // Esta línea sirve para declarar el método privado que obtiene el número de soporte normalizado.
    private function supportPhone(): ?string
    {
        // Esta línea sirve para revisar si todavía no se calculó.
        if (! $this->supportPhoneResolved) {
            // Esta línea sirve para normalizar el número configurado y guardarlo.
            $this->normalizedSupportPhone = $this->normalizePhone(config('app.support_whatsapp_number'));
            // Esta línea sirve para recordar que ya se calculó.
            $this->supportPhoneResolved = true;
        }

        // Esta línea sirve para devolver el número normalizado.
        return $this->normalizedSupportPhone;
    }

    /**
     * Saludo + cuerpo + firma — las 5 plantillas de estado comparten este
     * mismo armazón y solo difieren en el cuerpo (y, deliveredTemplate,
     * en el cierre). Antes cada método retipeaba "Hola {name} 👋" y
     * "Equipo SanKen 💪" por separado.
     */
    // Esta línea sirve para declarar el método privado que arma saludo, cuerpo y firma del mensaje.
    private function wrap(string $name, string $body, string $closing = 'Equipo SanKen 💪'): string
    {
        // Esta línea sirve para devolver el mensaje completo.
        return "Hola {$name} 👋\n\n{$body}\n\n{$closing}";
    }

    // Esta línea sirve para declarar la plantilla del estado "confirmando".
    private function confirmingTemplate(string $name, string $number): string
    {
        // Esta línea sirve para devolver el mensaje envuelto con saludo y firma.
        return $this->wrap(
            // Esta línea sirve para pasar el nombre del cliente.
            $name,
            // Esta línea sirve para pasar el cuerpo que dice que se está confirmando el pedido.
            "Estamos confirmando tu pedido #{$number} de SanKen.\n\nTe mantendremos informado sobre cualquier actualización.",
        );
    }

    // Esta línea sirve para declarar la plantilla del estado "en camino".
    private function shippedTemplate(string $name, string $number, Order $order): string
    {
        // Esta línea sirve para armar el cuerpo que dice que el pedido va en camino.
        $body = "Tu pedido #{$number} ya está en camino 🚚";

        // Esta línea sirve para revisar si hay transportadora o número de guía.
        if ($order->carrier || $order->tracking_number) {
            // Esta línea sirve para agregar un salto de párrafo.
            $body .= "\n\n";
            // Esta línea sirve para agregar las líneas de seguimiento que existan.
            $body .= implode("\n", array_filter([
                // Esta línea sirve para agregar la línea de la transportadora, si hay.
                $order->carrier ? "Transportadora: {$order->carrier}" : null,
                // Esta línea sirve para agregar la línea del número de guía, si hay.
                $order->tracking_number ? "Guía: {$order->tracking_number}" : null,
            ]));
        }

        // Esta línea sirve para devolver el mensaje envuelto con saludo y firma.
        return $this->wrap($name, "{$body}\n\nCualquier duda estamos atentos.");
    }

    // Esta línea sirve para declarar la plantilla del estado "entregado".
    private function deliveredTemplate(string $name, string $number): string
    {
        // Esta línea sirve para devolver el mensaje envuelto con saludo y firma.
        return $this->wrap(
            // Esta línea sirve para pasar el nombre del cliente.
            $name,
            // Esta línea sirve para pasar el cuerpo que dice que el pedido fue entregado.
            "¡Tu pedido #{$number} ha sido entregado! 📦\n\nEsperamos que disfrutes tus productos.",
            // Esta línea sirve para pasar un cierre de agradecimiento.
            'Gracias por comprar en SanKen 💪',
        );
    }

    // Esta línea sirve para declarar la plantilla del estado "problema".
    private function problemTemplate(string $name, string $number, Order $order): string
    {
        // Esta línea sirve para agregar el mensaje del admin al cliente, si existe.
        $adminLine = $order->customer_message ? "\n\n{$order->customer_message}" : '';

        // Esta línea sirve para devolver el mensaje envuelto con saludo y firma.
        return $this->wrap(
            // Esta línea sirve para pasar el nombre del cliente.
            $name,
            // Esta línea sirve para pasar el cuerpo que explica el inconveniente.
            "Somos SanKen.\n\nTenemos un inconveniente con tu pedido #{$number} y queremos ayudarte a solucionarlo.{$adminLine}\n\nPor favor respóndenos por este medio.",
        );
    }

    /** Para pending/processing/cancelled — un aviso genérico con el estado actual y el mensaje del admin si hay uno cargado. */
    // Esta línea sirve para declarar la plantilla genérica para los demás estados.
    private function genericTemplate(string $name, string $number, Order $order): string
    {
        // Esta línea sirve para obtener el texto del estado actual.
        $status = OrderStatusCatalog::label($order->status);
        // Esta línea sirve para agregar el mensaje del admin al cliente, si existe.
        $extra = $order->customer_message ? "\n\n{$order->customer_message}" : '';

        // Esta línea sirve para devolver el mensaje envuelto con saludo y firma.
        return $this->wrap(
            // Esta línea sirve para pasar el nombre del cliente.
            $name,
            // Esta línea sirve para pasar el cuerpo con el estado actual del pedido.
            "Somos SanKen.\n\nTenemos una actualización sobre tu pedido #{$number}.\n\nEstado actual: {$status}{$extra}\n\nSi tienes alguna pregunta, estamos atentos.",
        );
    }

    // Esta línea sirve para declarar el método privado que obtiene el primer nombre.
    private function firstName(string $fullName): string
    {
        // Esta línea sirve para devolver la primera palabra del nombre (o el nombre completo).
        return trim(explode(' ', trim($fullName))[0] ?? $fullName) ?: $fullName;
    }

    // Esta línea sirve para declarar el método privado que arma el link wa.me.
    private function waMeUrl(string $phone, string $message): string
    {
        // Esta línea sirve para devolver el link con el número y el mensaje codificado.
        return "https://wa.me/{$phone}?text=".rawurlencode($message);
    }

    /**
     * wa.me necesita el número completo con código de país, sin '+' ni
     * espacios/guiones. SanKen opera en Colombia — un celular colombiano
     * sin código de país tiene 10 dígitos, así que a esos se les antepone
     * 57. Si el número ya viene más largo, se asume que ya trae el código
     * de país y se deja tal cual.
     */
    // Esta línea sirve para declarar el método privado que normaliza un número de teléfono.
    private function normalizePhone(?string $raw): ?string
    {
        // Esta línea sirve para revisar si no hay número.
        if (! $raw) {
            // Esta línea sirve para devolver null.
            return null;
        }

        // Esta línea sirve para dejar solo los dígitos del número.
        $digits = preg_replace('/\D+/', '', $raw);
        // Esta línea sirve para revisar si no quedó ningún dígito.
        if (! $digits) {
            // Esta línea sirve para devolver null.
            return null;
        }

        // Esta línea sirve para anteponer 57 (Colombia) si tiene 10 dígitos, si no dejarlo igual.
        return strlen($digits) === 10 ? '57'.$digits : $digits;
    }
}
