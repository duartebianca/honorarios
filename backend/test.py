from docxtpl import DocxTemplate
from docx.document import Document
from docx.oxml.shared import qn
from docx.oxml.text.paragraph import CT_P
from docx.text.paragraph import Paragraph
from docx.shape import InlineShape
import re

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

def gerar_recibo(data):
    try:
        # Carregar o modelo de documento
        doc = DocxTemplate('Recibo de Honorários - Box Visual Law 360.docx')
        print("Documento carregado com sucesso.")
        
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
            'v_parcela': data.get('parcela', ''),
            'v_valor': data.get('valor', ''),
            'v_data': data.get('data', '')
            
        }

        print("Contexto preparado para substituição:")
        for key, value in context.items():
            print(f"{key}: {value}")

        # Primeiro, realizar a substituição normal do documento
        doc.render(context)

        # Agora, procurar e substituir nas caixas de texto
        textboxes = find_textboxes(doc)
        for textbox in textboxes:
            replace_in_textboxes(textbox, context)

        # Salvar o arquivo gerado
        output_filename = f"Recibo_de_Honorarios_{data.get('numeroContrato', 'Recibo')}.docx"
        doc.save(output_filename)
        
        print(f"Documento gerado com sucesso: {output_filename}")
        return True

    except Exception as e:
        print(f"Erro ao processar o documento: {str(e)}")
        raise

# Função para teste
if __name__ == "__main__":
    mock_data = {
        "numeroContrato": "211",
        "nomeCliente": "Edinaldo Lima",
        "cnpj": "20000000000001",
        "beneficiario": "Magna Barbosa",
        "endereco": "Rua Presidente Nilo Peçanha, 531, Imbiribeira, Recife - PE",
        "oab": "26.600",
        "cpf": "12345678901",
        "telefone": "(81) 99999-9999",
        "email": "magna@advogados.com",
        "cep": "55.602.020",
        "parcela": 3,
        "valor": "R$ 1.500",
        "data": "25/10/2024"
    }

    gerar_recibo(mock_data)