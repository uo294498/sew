import xml.etree.ElementTree as ET

def escribirSVG(xmlFile, svgFile):
    tree = ET.parse(xmlFile)
    root = tree.getroot()

    # Namespace dictionary
    ns = {'uniovi': 'http://www.uniovi.es'}

    # Parámetros del SVG
    ancho = 800  # Ancho del SVG
    alto = 400  # Alto del SVG
    margen = 50  # Margen en los bordes
    escala_x = 5  # Escala horizontal (ajustable)
    escala_y = 2  # Escala vertical (ajustable)

    # Abrir archivo SVG para escritura
    with open(svgFile, 'w') as archivoSVG:
        archivoSVG.write('<?xml version="1.0" standalone="no"?>\n')
        archivoSVG.write('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n')
        archivoSVG.write(f'<svg width="{ancho}" height="{alto}" xmlns="http://www.w3.org/2000/svg" version="1.1">\n')

        # Dibujar la línea del suelo
        archivoSVG.write(f'<rect x="0" y="{alto - margen}" width="{ancho}" height="{margen}" fill="lightgray" />\n')

        # Iniciar la polilínea que representa el perfil de altimetría
        polilinea = '<polyline fill="none" stroke="black" stroke-width="2" points="'

        # Recorrer los tramos y extraer distancia y altitud
        puntos = []
        x_actual = margen
        for tramo in root.find('uniovi:tramos', ns).findall('uniovi:tramo', ns):
            distancia = float(tramo.attrib['distancia'])
            coord = tramo.find('uniovi:coord', ns)
            altitud = float(coord.find('uniovi:coordalt', ns).text)

            # Calcular las coordenadas del punto en el SVG
            x_punto = x_actual
            y_punto = alto - margen - (altitud * escala_y)
            puntos.append(f'{x_punto},{y_punto}')

            # Actualizar la posición horizontal
            x_actual += distancia * escala_x

        # Cerrar la polilínea con los puntos
        polilinea += ' '.join(puntos) + '" />\n'
        archivoSVG.write(polilinea)

        # Cerrar el archivo SVG
        archivoSVG.write('</svg>')

if __name__ == "__main__":
    # Llamada a la función para generar el archivo SVG
    escribirSVG("circuitoEsquema.xml", "perfil.svg")
