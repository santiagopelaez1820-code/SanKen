<?php

namespace App\Domain\Order\Services;

use App\Domain\Order\OrderStatusCatalog;
use App\Models\Order;

/**
 * Arma el texto (y el link wa.me) del mensaje de WhatsApp para un pedido —
 * una plantilla por estado, pensadas para poder ajustarse acá sin tocar
 * nada del resto del flujo (Resources/Controllers solo piden el texto ya
 * armado). No manda nada por su cuenta: el superadmin sigue abriendo el
 * link y enviando el mensaje a mano — WhatsApp Business API es una fase
 * posterior (ver punto 16 del pedido de Fase 3).
 */
class OrderWhatsAppMessageBuilder
{
    /** Normalizar config('app.support_whatsapp_number') es el mismo trabajo en cada fila de un listado de pedidos — se cachea una vez por instancia (que además es singleton, ver AppServiceProvider). */
    private ?string $normalizedSupportPhone = null;

    private bool $supportPhoneResolved = false;

    /**
     * Mensaje del superadmin hacia el cliente sobre el estado de su pedido.
     */
    public function buildCustomerMessage(Order $order): string
    {
        $name = $this->firstName($order->customer_name);
        $number = $order->orderNumber();

        return match ($order->status) {
            OrderStatusCatalog::CONFIRMING => $this->confirmingTemplate($name, $number),
            OrderStatusCatalog::SHIPPED => $this->shippedTemplate($name, $number, $order),
            OrderStatusCatalog::DELIVERED => $this->deliveredTemplate($name, $number),
            OrderStatusCatalog::PROBLEM => $this->problemTemplate($name, $number, $order),
            default => $this->genericTemplate($name, $number, $order),
        };
    }

    /**
     * Link wa.me hacia el WhatsApp del CLIENTE, con el mensaje según estado
     * ya cargado — null si el pedido no tiene un WhatsApp utilizable.
     */
    public function buildCustomerUrl(Order $order): ?string
    {
        $phone = $this->normalizePhone($order->customer_whatsapp);
        if (! $phone) {
            return null;
        }

        return $this->waMeUrl($phone, $this->buildCustomerMessage($order));
    }

    /**
     * Link wa.me hacia la línea de atención de SanKen (config('app.support_whatsapp_number'))
     * — para que el CLIENTE escriba por soporte. null si no hay número configurado.
     */
    public function buildSupportUrl(Order $order): ?string
    {
        $phone = $this->supportPhone();
        if (! $phone) {
            return null;
        }

        $message = "Hola SanKen 👋\n\nTengo una consulta sobre mi pedido #{$order->orderNumber()}.";

        return $this->waMeUrl($phone, $message);
    }

    /**
     * config('app.support_whatsapp_number') no cambia entre pedidos — sin
     * este cache, listar 50 pedidos normalizaba (regex + substr) el mismo
     * número fijo 50 veces por request.
     */
    private function supportPhone(): ?string
    {
        if (! $this->supportPhoneResolved) {
            $this->normalizedSupportPhone = $this->normalizePhone(config('app.support_whatsapp_number'));
            $this->supportPhoneResolved = true;
        }

        return $this->normalizedSupportPhone;
    }

    /**
     * Saludo + cuerpo + firma — las 5 plantillas de estado comparten este
     * mismo armazón y solo difieren en el cuerpo (y, deliveredTemplate,
     * en el cierre). Antes cada método retipeaba "Hola {name} 👋" y
     * "Equipo SanKen 💪" por separado.
     */
    private function wrap(string $name, string $body, string $closing = 'Equipo SanKen 💪'): string
    {
        return "Hola {$name} 👋\n\n{$body}\n\n{$closing}";
    }

    private function confirmingTemplate(string $name, string $number): string
    {
        return $this->wrap(
            $name,
            "Estamos confirmando tu pedido #{$number} de SanKen.\n\nTe mantendremos informado sobre cualquier actualización.",
        );
    }

    private function shippedTemplate(string $name, string $number, Order $order): string
    {
        $body = "Tu pedido #{$number} ya está en camino 🚚";

        if ($order->carrier || $order->tracking_number) {
            $body .= "\n\n";
            $body .= implode("\n", array_filter([
                $order->carrier ? "Transportadora: {$order->carrier}" : null,
                $order->tracking_number ? "Guía: {$order->tracking_number}" : null,
            ]));
        }

        return $this->wrap($name, "{$body}\n\nCualquier duda estamos atentos.");
    }

    private function deliveredTemplate(string $name, string $number): string
    {
        return $this->wrap(
            $name,
            "¡Tu pedido #{$number} ha sido entregado! 📦\n\nEsperamos que disfrutes tus productos.",
            'Gracias por comprar en SanKen 💪',
        );
    }

    private function problemTemplate(string $name, string $number, Order $order): string
    {
        $adminLine = $order->customer_message ? "\n\n{$order->customer_message}" : '';

        return $this->wrap(
            $name,
            "Somos SanKen.\n\nTenemos un inconveniente con tu pedido #{$number} y queremos ayudarte a solucionarlo.{$adminLine}\n\nPor favor respóndenos por este medio.",
        );
    }

    /** Para pending/processing/cancelled — un aviso genérico con el estado actual y el mensaje del admin si hay uno cargado. */
    private function genericTemplate(string $name, string $number, Order $order): string
    {
        $status = OrderStatusCatalog::label($order->status);
        $extra = $order->customer_message ? "\n\n{$order->customer_message}" : '';

        return $this->wrap(
            $name,
            "Somos SanKen.\n\nTenemos una actualización sobre tu pedido #{$number}.\n\nEstado actual: {$status}{$extra}\n\nSi tienes alguna pregunta, estamos atentos.",
        );
    }

    private function firstName(string $fullName): string
    {
        return trim(explode(' ', trim($fullName))[0] ?? $fullName) ?: $fullName;
    }

    private function waMeUrl(string $phone, string $message): string
    {
        return "https://wa.me/{$phone}?text=".rawurlencode($message);
    }

    /**
     * wa.me necesita el número completo con código de país, sin '+' ni
     * espacios/guiones. SanKen opera en Colombia — un celular colombiano
     * sin código de país tiene 10 dígitos, así que a esos se les antepone
     * 57. Si el número ya viene más largo, se asume que ya trae el código
     * de país y se deja tal cual.
     */
    private function normalizePhone(?string $raw): ?string
    {
        if (! $raw) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $raw);
        if (! $digits) {
            return null;
        }

        return strlen($digits) === 10 ? '57'.$digits : $digits;
    }
}
