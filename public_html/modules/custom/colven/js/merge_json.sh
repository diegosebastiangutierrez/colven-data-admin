#!/bin/bash

# Verificar que jq esté instalado
if ! command -v jq &> /dev/null
then
    echo "jq no está instalado. Por favor, instálalo e intenta nuevamente."
    exit 1
fi

# Archivo de entrada
INPUT_FILE="input.json"
# Archivo de salida
OUTPUT_FILE="merged.json"

# Leer el JSON de entrada y realizar el merge y mapeo
jq 'reduce .[] as $item ({}; .[$item.title + "_" + $item.firstname + "_" + $item.month] |= {
    name: $item.title,
    country: $item.firstname,
    state: $item.month,
    location: ($item.lat|tostring + ", " + $item.lng|tostring),
    products: ((.products + ", " + $item.farm) | split(", ") | map(select(length > 0)) | unique | join(", ")),
    email: $item.email,
    phone: $item.phone,
    address: $item.address
}) | to_entries | map(.value)' "$INPUT_FILE" > "$OUTPUT_FILE"

echo "Datos mergeados y mapeados guardados en $OUTPUT_FILE"
