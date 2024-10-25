import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Button,
  Input,
  Box,
  Text,
  Heading,
  Grid,
  GridItem,
  Image,
  Select,
  Step,
  StepIndicator,
  Stepper,
  StepNumber,
  StepTitle,
} from '@chakra-ui/react';
import NavBar from '../../shared/components/nav-bar';

// Definindo os endpoints para cada tipo de documento
const endpoints = {
  'Recibo de Honorários': 'https://honorarios.onrender.com/api/gerar-recibo',
  'Procuração': 'https://honorarios.onrender.com/api/gerar-procuracao',
  // Novos tipos de documento podem ser adicionados aqui
};

// Definindo o esquema de validação Zod para Recibo de Honorários
const schemaRecibo = z.object({
  nomeCliente: z.string().nonempty('Nome do cliente é obrigatório'),
  cnpj: z.string().length(14, 'CNPJ deve ter 14 dígitos'),
  endereco: z.string().nonempty('Endereço é obrigatório'),
  cep: z.string().length(8, 'CEP deve ter 8 dígitos'),
  numeroContrato: z.string().nonempty('Número do contrato é obrigatório'),
  parcelas: z.string().transform((val) => parseInt(val, 10)).refine(val => !isNaN(val) && val > 0, { message: 'Deve haver ao menos uma parcela' }),
  valor: z.string().transform((val) => parseFloat(val)).refine(val => val >= 0, { message: 'O valor deve ser positivo' }),
  data: z.string().nonempty('Data é obrigatória'),
  telefone: z.string().nonempty('Telefone é obrigatório'),
  email: z.string().email('Email inválido'),
});

// Definindo o esquema de validação Zod para Procuração
const schemaProcuracao = z.object({
  nomeCliente: z.string().nonempty('Nome do cliente é obrigatório'),
  nacionalidadeCliente: z.string().nonempty('Nacionalidade do cliente é obrigatória'),
  profissao: z.string().nonempty('Profissão é obrigatória'),
  enderecoCliente: z.string().nonempty('Endereço do cliente é obrigatório'),
  cnpj: z.string().length(14, 'CNPJ deve ter 14 dígitos'),
  nomeEmpresa: z.string().nonempty('Nome da empresa é obrigatório'),
  data: z.string().nonempty('Data é obrigatória'),
});

const Formulario = () => {
  const [step, setStep] = useState(0);
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [advogados, setAdvogados] = useState([]);
  const [selectedAdvogado, setSelectedAdvogado] = useState(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(tipoDocumento === 'Recibo de Honorários' ? schemaRecibo : schemaProcuracao),
  });

  useEffect(() => {
    const fetchAdvogados = async () => {
      const response = await fetch('https://honorarios.onrender.com/api/advogados');
      const data = await response.json();
      setAdvogados(data);
    };
    fetchAdvogados();
  }, []);

  const handleAdvogadoChange = (event) => {
    const selectedAdvogado = advogados.find(adv => adv.beneficiario === event.target.value);
    setSelectedAdvogado(selectedAdvogado);
    if (selectedAdvogado) {
      setValue('beneficiario', selectedAdvogado.beneficiario);
      setValue('telefone', selectedAdvogado.telefone);
      setValue('email', selectedAdvogado.email);
      setValue('cpf', selectedAdvogado.cpf);
      setValue('oab', selectedAdvogado.oab);
      setValue('tratamento', selectedAdvogado.tratamento);
      setValue('enderecoAdvogado', selectedAdvogado.endereco);
      setValue('nacionalidadeAdvogado', selectedAdvogado.nacionalidade);
    }
  };

  const handleNextStep = () => {
    if (tipoDocumento && selectedAdvogado) {
      setStep(1);
    }
  };

  const handleBackStep = () => {
    setStep(0);
  };

  const onSubmit = async (data) => {
    const extendedData = {
      ...data,
      beneficiario: selectedAdvogado?.beneficiario,
      oab: selectedAdvogado?.oab,
      cpf: selectedAdvogado?.cpf,
      tratamento: selectedAdvogado?.tratamento,
      enderecoAdvogado: selectedAdvogado?.endereco,
      nacionalidadeAdvogado: selectedAdvogado?.nacionalidade
    };

    const apiEndpoint = endpoints[tipoDocumento];

    if (!apiEndpoint) {
      alert('Tipo de documento não suportado.');
      return;
    }

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(extendedData),
    });

    const fileBlob = await response.blob();
    const url = window.URL.createObjectURL(fileBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tipoDocumento} - ${data.nomeCliente}.docx`;
    a.click();
  };

  return (
    <>
      <NavBar />
      <Box maxW="800px" mx="auto" mt="20px" p={6} fontFamily="Inter">

        <Grid templateColumns="repeat(12, 1fr)" gap={4} alignItems="center" mb={6}>
          <GridItem colSpan={[12, 2]}>
            <Image src="https://i.imgur.com/O2uKPTh.png" alt="Logo" boxSize="100px" objectFit="contain" />
          </GridItem>
          <GridItem colSpan={[12, 6]} textAlign="left">
            <Text fontSize="2xl" fontWeight="300" color="#a78466">GERADOR DE</Text>
            <Heading as="h1" fontSize="4xl" fontWeight="700" color="#14365d">DOCX JURÍDICO</Heading>
          </GridItem>
          <GridItem colSpan={[12, 4]}>
            <Box bg="#ffbd59" p={3} borderRadius="md" width="100%" height="fit-content" textAlign="center">
              <Text fontSize="sm">
                Gere <strong>automaticamente</strong> documentos jurídicos preenchendo este formulário.
              </Text>
            </Box>
          </GridItem>
        </Grid>

        <Stepper index={step} orientation="horizontal" mb={6}>
          <Step>
            <StepIndicator>
              <StepNumber />
            </StepIndicator>
            <StepTitle>Escolher Documento</StepTitle>
          </Step>
          <Step>
            <StepIndicator>
              <StepNumber />
            </StepIndicator>
            <StepTitle>Preencher Formulário</StepTitle>
          </Step>
        </Stepper>

        {step === 0 && (
          <>
            <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={6}>
              <GridItem colSpan={[12, 6]}>
                <Text mb="2">Tipo de Documento</Text>
                <Select placeholder="Selecione o tipo de documento" onChange={(e) => setTipoDocumento(e.target.value)}>
                  <option value="Recibo de Honorários">Recibo de Honorários</option>
                  <option value="Procuração">Procuração</option>
                </Select>
              </GridItem>
              <GridItem colSpan={[12, 6]}>
                <Text mb="2">Advogado(a)</Text>
                <Select placeholder="Selecione o(a) Advogado(a)" onChange={handleAdvogadoChange}>
                  {advogados.map(adv => (
                    <option key={adv.beneficiario} value={adv.beneficiario}>
                      {adv.beneficiario}
                    </option>
                  ))}
                </Select>
              </GridItem>
            </Grid>
            <Button mt="20px" colorScheme="teal" width="full" onClick={handleNextStep}>
              Próxima Etapa
            </Button>
          </>
        )}

        {step === 1 && (
          <Box as="form" onSubmit={handleSubmit(onSubmit)} mt={6}>
            {tipoDocumento === 'Recibo de Honorários' && (
              <>
                <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                  <GridItem colSpan={[12, 6]}>
                    <Text mb="2">Nome do Cliente</Text>
                    <Input {...register('nomeCliente')} />
                    {errors.nomeCliente && <Text color="red.500">{String(errors.nomeCliente.message)}</Text>}
                  </GridItem>
                  <GridItem colSpan={[12, 6]}>
                    <Text mb="2">CNPJ</Text>
                    <Input {...register('cnpj')} />
                    {errors.cnpj?.message && <Text color="red.500">{String(errors.cnpj.message)}</Text>}
                  </GridItem>
                  <GridItem colSpan={[12, 6]}>
                    <Text mb="2">Endereço</Text>
                    <Input {...register('endereco')} />
                    {errors.endereco && <Text color="red.500">{String(errors.endereco.message)}</Text>}
                  </GridItem>
                  <GridItem colSpan={[12, 6]}>
                    <Text mb="2">CEP</Text>
                    <Input {...register('cep')} />
                    {errors.cep && <Text color="red.500">{String(errors.cep.message)}</Text>}
                  </GridItem>
                  <GridItem colSpan={[12, 6]}>
                    <Text mb="2">Nº do Contrato</Text>
                    <Input {...register('numeroContrato')} />
                    {errors.numeroContrato && <Text color="red.500">{String(errors.numeroContrato.message)}</Text>}
                  </GridItem>
                  <GridItem colSpan={[12, 3]}>
                    <Text mb="2">Parcelas</Text>
                    <Input type="number" {...register('parcelas')} />
                    {errors.parcelas && <Text color="red.500">{String(errors.parcelas.message)}</Text>}
                  </GridItem>
                  <GridItem colSpan={[12, 3]}>
                    <Text mb="2">Valor</Text>
                    <Input type="number" {...register('valor')} />
                    {errors.valor?.message && <Text color="red.500">{errors.valor.message as string}</Text>}
                  </GridItem>
                  <GridItem colSpan={[12, 6]}>
                    <Text mb="2">Data</Text>
                    <Input type="date" {...register('data')} />
                    {errors.data?.message && <Text color="red.500">{errors.data.message as string}</Text>}
                  </GridItem>
                </Grid>
              </>
            )}

            {tipoDocumento === 'Procuração' && (
              <>
                <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                  <GridItem colSpan={[12, 6]}>
                    <Text mb="2">Nome do Cliente</Text>
                    <Input {...register('nomeCliente')} />
                    {errors.nomeCliente && <Text color="red.500">{String(errors.nomeCliente.message)}</Text>}
                  </GridItem>
                  <GridItem colSpan={[12, 6]}>
                    <Text mb="2">Nacionalidade do Cliente</Text>
                    <Input {...register('nacionalidadeCliente')} />
                    {errors.nacionalidadeCliente && <Text color="red.500">{String(errors.nacionalidadeCliente.message)}</Text>}
                  </GridItem>
                  <GridItem colSpan={[12, 6]}>
                    <Text mb="2">Profissão</Text>
                    <Input {...register('profissao')} />
                    {errors.profissao && <Text color="red.500">{String(errors.profissao.message)}</Text>}
                  </GridItem>
                  <GridItem colSpan={[12, 6]}>
                    <Text mb="2">Endereço do Cliente</Text>
                    <Input {...register('enderecoCliente')} />
                    {errors.enderecoCliente && <Text color="red.500">{String(errors.enderecoCliente.message)}</Text>}
                  </GridItem>
                  <GridItem colSpan={[12, 6]}>
                    <Text mb="2">CNPJ</Text>
                    <Input {...register('cnpj')} />
                    {errors.cnpj && <Text color="red.500">{String(errors.cnpj.message)}</Text>}
                  </GridItem>
                  <GridItem colSpan={[12, 6]}>
                    <Text mb="2">Nome da Empresa</Text>
                    <Input {...register('nomeEmpresa')} />
                    {errors.nomeEmpresa && <Text color="red.500">{String(errors.nomeEmpresa.message)}</Text>}
                  </GridItem>
                  <GridItem colSpan={[12, 6]}>
                    <Text mb="2">Data</Text>
                    <Input type="date" {...register('data')} />
                    {errors.data && <Text color="red.500">{String(errors.data.message)}</Text>}
                  </GridItem>
                </Grid>
              </>
            )}

            <Button mt="20px" type="submit" colorScheme="teal" width="full">
              Gerar Documento
            </Button>
            <Button mt="4" colorScheme="gray" width="full" onClick={handleBackStep}>
              Voltar
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Formulario;
