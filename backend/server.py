from flask import Flask, request, send_file
from docx import Document
import io

app = Flask(__name__)

@app.route('/api/gerar-recibo', methods=['POST'])
def gerar_recibo():
    data = request.json

    # Carregar o modelo de documento
    doc = Document('Model.docx')

    # Substituir as variáveis no documento
    for p in doc.paragraphs:
        if 'xxxxx' in p.text:
            p.text = p.text.replace('xxxxx', data['numeroContrato'])
        if 'CLIENTE' in p.text:
            p.text = p.text.replace('CLIENTE', data['nomeCliente'])
        # Continue para outros campos como CNPJ, Beneficiário, etc.

    # Gerar o documento como resposta
    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)

    return send_file(buffer, as_attachment=True, download_name=f"Recibo de Honorários - {data['numeroContrato']}.docx")

if __name__ == '__main__':
    app.run()
