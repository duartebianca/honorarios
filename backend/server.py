from flask import Flask, request, send_file, jsonify
from docx import Document
import io

app = Flask(__name__)

@app.route('/api/gerar-recibo', methods=['POST'])
def gerar_recibo():
    data = request.json

    # Verificação básica para garantir que todos os dados necessários estejam presentes
    required_fields = ['numeroContrato', 'nomeCliente', 'cnpj', 'beneficiario', 'endereco']
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({'error': f'Campos faltando: {", ".join(missing_fields)}'}), 400

    # Carregar o modelo de documento
    try:
        doc = Document('/mnt/data/Recibo de Honorários - Box Visual Law 360.docx')
    except Exception as e:
        return jsonify({'error': f'Erro ao carregar o documento: {str(e)}'}), 500

    # Função para substituir texto no parágrafo, mesmo se dividido em diferentes runs
    def replace_text_in_paragraph(paragraph, search_text, replace_text):
        for run in paragraph.runs:
            if search_text in run.text:
                run.text = run.text.replace(search_text, replace_text)

    # Substituir as variáveis no documento
    for p in doc.paragraphs:
        replace_text_in_paragraph(p, 'xxxxx', data.get('numeroContrato', ''))
        replace_text_in_paragraph(p, 'CLIENTE', data.get('nomeCliente', ''))
        replace_text_in_paragraph(p, '00000000000000', data.get('cnpj', ''))  # Exemplo de CNPJ
        replace_text_in_paragraph(p, 'BENEFICIÁRIO', data.get('beneficiario', ''))
        replace_text_in_paragraph(p, 'Rua', data.get('endereco', ''))  # Exemplo de endereço
        # Continue substituindo outros campos conforme necessário.

    # Gerar o documento como resposta
    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)

    return send_file(buffer, as_attachment=True, 
                     download_name=f"Recibo de Honorários - {data.get('numeroContrato', 'Recibo')}.docx",
                     mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document')

if __name__ == '__main__':
    app.run(debug=True)
