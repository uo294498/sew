import xml.etree.ElementTree as ET

import os


# Funciones para escribir el archivo KML
def prologoKML(archivo, root, ns):
    nombre = root.find('uniovi:nombre', ns).text
    coordLong = root.find('uniovi:coord/uniovi:coordlong', ns).text
    coordLat = root.find('uniovi:coord/uniovi:coordlat', ns).text
    coordAlt = root.find('uniovi:coord/uniovi:coordalt', ns).text

    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document id='Universidad de Oviedo'>\n")
    archivo.write("<Placemark>\n") ## Inicio marcador
    archivo.write(f"<name>{nombre}</name>\n")
    archivo.write(f"<description>{nombre}</description>\n")
    archivo.write("<Point>\n")
    archivo.write("<coordinates>\n")
    archivo.write(f"{coordLong},{coordLat},{coordAlt}\n")
    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</Point>\n")
    archivo.write("</Placemark>\n") ## Fin marcador
    archivo.write(f"<name>Ruta del circuito</name>\n")
    archivo.write("<Placemark>\n")
    archivo.write("<LineString>\n")
    archivo.write("<extrude>1</extrude>\n")
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")

def epilogoKML(archivo):
    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n")

def escribirKML(xmlFile, kmlFile):
    tree = ET.parse(xmlFile)
    root = tree.getroot()

    # Namespace dictionary
    ns = {'uniovi': 'http://www.uniovi.es'}

    # Abrir el archivo KML de salida
    with open(kmlFile, 'w') as archivoKML:
        # Ahora buscar elementos incluyendo el namespace
        prologoKML(archivoKML, root, ns)

        # Obtener las coordenadas de los tramos
        for tramo in root.find('uniovi:tramos', ns).findall('uniovi:tramo', ns):
            coord = tramo.find('uniovi:coord', ns)
            coordLong = coord.find('uniovi:coordlong', ns).text
            coordLat = coord.find('uniovi:coordlat', ns).text
            coordAlt = coord.find('uniovi:coordalt', ns).text
            archivoKML.write(f"{coordLong},{coordLat},{coordAlt}\n")

        epilogoKML(archivoKML)


if __name__ == "__main__":
    # Llamada a la función para generar el archivo KML
    escribirKML("circuitoEsquema.xml", "circuito.kml")