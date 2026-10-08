<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las reglas de validación.

namespace App\Rules;

/**
 * "Formato razonable" de teléfono: dígitos con opcional '+' inicial y
 * separadores comunes (espacio/guión), 7 a 15 dígitos reales — sin atarse a
 * un país específico (E.164 es flexible a propósito). Compartida por
 * cualquier FormRequest que reciba un teléfono de contacto (pedidos,
 * registro, etc.) — antes vivía duplicada solo en StoreOrderRequest.
 *
 * El lookahead (?=(?:[^0-9]*[0-9]){7,15}[^0-9]*$) cuenta los dígitos reales
 * del string completo — sin él, algo como "-------" (puros guiones, cero
 * dígitos) pasaba la validación porque el largo total caía dentro del rango
 * aunque no hubiera ni un dígito.
 */
// Esta línea sirve para declarar la clase con el formato de teléfono compartido.
final class PhoneFormat
{
    // Esta línea sirve para definir la expresión regular: 7 a 15 dígitos, "+" inicial opcional, espacios y guiones.
    public const REGEX = '/^(?=(?:[^0-9]*[0-9]){7,15}[^0-9]*$)\+?[0-9 \-]{7,20}$/';
}
