<?php

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
final class PhoneFormat
{
    public const REGEX = '/^(?=(?:[^0-9]*[0-9]){7,15}[^0-9]*$)\+?[0-9 \-]{7,20}$/';
}
