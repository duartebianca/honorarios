from flask import Flask, request, send_file, jsonify
from docxtpl import DocxTemplate
from docx.document import Document
from docx.oxml.shared import qn
from docx.oxml.text.paragraph import CT_P
from docx.text.paragraph import Paragraph
from docx.shape import InlineShape
import re
import io
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

advogados = [
    {
        "beneficiario": "Magna Barbosa",
        "oab": "26.600",
        "telefone": "(81) 99999-9999",
        "email": "magna@advogados.com",
        "cpf": "12345678901",
        "tratamento": "DRA",
        "endereco": "Rua dos Advogados, 123, Recife - PE",
        "nacionalidade": "brasileira",
    },
    {
        "beneficiario": "João Barros",
        "oab": "12.600",
        "telefone": "(87) 99499-9999",
        "email": "joao@advogados.com",
        "cpf": "12345678222",
        "tratamento": "DR",
        "endereco": "Rua dos Advogados, 123, Recife - PE",
        "nacionalidade": "brasileiro",
    }
]

@app.route('/api/advogados', methods=['GET'])
def get_advogados():
    return jsonify(advogados), 200

def find_textboxes(doc):
    """Encontra todas as caixas de texto no documento"""
    textboxes = []
    for shape in doc.element.body.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}txbxContent'):
        textboxes.append(shape)
    return textboxes

def replace_in_textboxes(textbox, context):
    """Substitui as variáveis em uma caixa de texto específica"""
    for paragraph in textbox.iterchildren('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
        for run in paragraph.iterchildren('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}r'):
            for text in run.iterchildren('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                for key, value in context.items():
                    pattern = r'\{\{\s*' + re.escape(key) + r'\s*\}\}'
                    if re.search(pattern, text.text):
                        text.text = re.sub(pattern, str(value), text.text)

def formatar_data(data):
    ano, mes, dia = data.split('-')
    return f'{dia}/{mes}/{ano}'

# Função para gerar procuração
@app.route('/api/gerar-procuracao', methods=['POST'])
def gerar_procuracao_api():
    try:
        # Obter dados do request JSON
        data = request.json
        print("Dados recebidos:", data)

        # Verificação de campos obrigatórios
        required_fields = [
            'nomeCliente', 'nacionalidadeCliente', 'profissao', 'cnpj', 'enderecoCliente', 
            'beneficiario', 'nacionalidadeAdvogado', 'oab', 'enderecoAdvogado', 'nomeEmpresa', 'data'
        ]

        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            print(f"Campos faltando: {missing_fields}")
            return jsonify({
                'error': 'Campos obrigatórios faltando',
                'missing_fields': missing_fields
            }), 400

        # Carregar o modelo de documento de procuração
        template_path = os.path.join(os.path.dirname(__file__), 'Procuração I - Box Visual Law.docx')
        doc = DocxTemplate(template_path)

        # Preparar o contexto com os dados
        context = {
            'v_nome_cliente': data.get('nomeCliente', ''),
            'v_nacionalidade_cliente': data.get('nacionalidadeCliente', ''),  # Corrigido para buscar 'nacionalidadeCliente'
            'v_profissao': data.get('profissao', ''),
            'v_cnpj': data.get('cnpj', ''),  # Certifique-se de que o CNPJ está sendo enviado corretamente
            'v_endereco_cliente': data.get('enderecoCliente', ''),  # Usar 'enderecoCliente' para o endereço do cliente
            'v_nome_advogado': data.get('beneficiario', ''),
            'v_nacionalidade_advogado': data.get('nacionalidadeAdvogado', ''),
            'v_oab': data.get('oab', ''),
            'v_endereco_advogado': data.get('enderecoAdvogado', ''),
            'v_nome_empresa': data.get('nomeEmpresa', ''),
            'v_data': formatar_data(data.get('data')),
        }

        print("Contexto para renderização:", context)

        # Realizar a substituição normal do documento
        doc.render(context)

        # Criar buffer para armazenar o documento
        buffer = io.BytesIO()
        doc.save(buffer)
        buffer.seek(0)

        # Enviar o arquivo como resposta
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"Procuracao_{data.get('nomeCliente', 'Procuracao')}.docx",
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Função existente para gerar recibo
@app.route('/api/gerar-recibo', methods=['POST'])
def gerar_recibo_api():
    try:
        # Obter dados do request JSON
        data = request.json
        print("Dados recebidos:", data)

        # Verificação de campos obrigatórios
        required_fields = [
            'numeroContrato', 'nomeCliente', 'cnpj', 'beneficiario', 
            'endereco', 'oab', 'cpf', 'telefone', 'email', 'cep',
            'parcelas', 'valor', 'data', 'tratamento'
        ]

        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            print(f"Campos faltando: {missing_fields}")
            return jsonify({
                'error': 'Campos obrigatórios faltando',
                'missing_fields': missing_fields
            }), 400

        # Carregar o modelo de documento
        template_path = os.path.join(os.path.dirname(__file__), 'Recibo de Honorários - Box Visual Law 360.docx')
        doc = DocxTemplate(template_path)

        # Preparar o contexto com os dados
        context = {
            'v_nome_advogado': data.get('beneficiario', ''),
            'v_oab': data.get('oab', ''),
            'v_cpf': data.get('cpf', ''),
            'v_nome_cliente': data.get('nomeCliente', ''),
            'v_cnpj': data.get('cnpj', ''),
            'v_endereco': data.get('endereco', ''),
            'v_contrato': data.get('numeroContrato', ''),
            'v_telefone': data.get('telefone', ''),
            'v_email': data.get('email', ''),
            'v_cep': data.get('cep', ''),
            'v_parcela': data.get('parcelas', ''),
            'v_valor': data.get('valor', ''),
            'v_data': formatar_data(data.get('data')),
            'v_tratamento': data.get('tratamento', '')
        }
        print("Contexto para renderização:", context)

        # Realizar a substituição normal do documento
        doc.render(context)

        # Procurar e substituir nas caixas de texto
        textboxes = find_textboxes(doc)
        for textbox in textboxes:
            replace_in_textboxes(textbox, context)

        # Criar buffer para armazenar o documento
        buffer = io.BytesIO()
        doc.save(buffer)
        buffer.seek(0)

        # Enviar o arquivo como resposta
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"Recibo_de_Honorarios_{data.get('numeroContrato', 'Recibo')}.docx",
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rota de teste para verificar se a API está funcionando
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'API está funcionando corretamente'})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
