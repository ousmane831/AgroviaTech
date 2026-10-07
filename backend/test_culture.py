import zipfile
import csv
import io

with zipfile.ZipFile("dataset.zip") as z:
    raw = z.read("input/culture/culture.csv").decode("cp1252")

lines = raw.splitlines()

rows = [
    next(csv.reader([line.strip().strip('"')], delimiter=","))
    for line in lines
    if line.strip()
]

print("Colonnes :", rows[0])
print("Première ligne :", rows[1])
print("Nombre de lignes :", len(rows) - 1)