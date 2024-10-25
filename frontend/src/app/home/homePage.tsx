import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Input, Box, Text, Heading, Grid, GridItem, Image, Divider } from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import NavBar from '../../shared/components/nav-bar';

// Definindo o esquema de validação Zod
const schema = z.object({
  beneficiario: z.string().nonempty('Beneficiário é obrigatório'),
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
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  oab: z.string().nonempty('OAB é obrigatório'),
  tratamento: z.string().nonempty('Tratamento é obrigatório'),
});

// Tipando o formulário baseado no esquema Zod
type FormData = z.infer<typeof schema>;

const Formulario = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [advogados, setAdvogados] = useState([]);

  useEffect(() => {
    // Carregar advogados do backend
    const fetchAdvogados = async () => {
      const response = await fetch('http://localhost:5000/api/advogados');
      const data = await response.json();
      setAdvogados(data);
    };

    fetchAdvogados();
  }, []);

  const handleAdvogadoChange = (event) => {
    const selectedAdvogado = advogados.find(adv => adv.beneficiario === event.target.value);
    if (selectedAdvogado) {
      // Preencher os campos automaticamente com os dados do advogado selecionado
      setValue('beneficiario', selectedAdvogado.beneficiario);
      setValue('telefone', selectedAdvogado.telefone);
      setValue('email', selectedAdvogado.email);
      setValue('cpf', selectedAdvogado.cpf);
      setValue('oab', selectedAdvogado.oab);
      setValue('tratamento', selectedAdvogado.tratamento);
    }
  };

  const onSubmit = async (data: FormData) => {
    const response = await fetch('http://localhost:5000/api/gerar-recibo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const fileBlob = await response.blob();
    const url = window.URL.createObjectURL(fileBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Recibo de Honorários - ${data.numeroContrato}.docx`;
    a.click();
  };

  return (
    <>
      <NavBar /> {/* Adicionando a NavBar fora do formulário */}
      <Box as="form" onSubmit={handleSubmit(onSubmit)} maxW="800px" mx="auto" mt="20px" p={6} fontFamily="Inter">
        
        {/* Cabeçalho com logo e título */}
        <Grid templateColumns="repeat(12, 1fr)" gap={4} alignItems="center">
          <GridItem colSpan={[12, 2]}>
            <Image src="https://i.imgur.com/O2uKPTh.png" alt="Logo" boxSize="100px" objectFit="contain" />
          </GridItem>
          <GridItem colSpan={[12, 6]} textAlign="left">
            <Text fontSize="2xl" fontWeight="300" color="#a78466">RECIBO DE</Text>
            <Heading as="h1" fontSize="4xl" fontWeight="700" color="#14365d">HONORÁRIOS</Heading>
          </GridItem>
          <GridItem colSpan={[12, 4]}>
            <Box bg="#ffbd59" p={3} borderRadius="md" width="100%" height="fit-content" textAlign="center">
              <Text fontSize="sm">
                Gere <strong>automaticamente</strong> os recibos dos seus honorários preenchendo este formulário.
              </Text>
            </Box>
          </GridItem>
        </Grid>

        {/* Corpo do formulário */}
        <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={6}>
          <GridItem colSpan={[12, 6]}>
            <Text mb="2">Advogado(a)</Text>
            <Select placeholder="Selecione o(a) Advogado(a)" onChange={handleAdvogadoChange}>
              {advogados.map(adv => (
                <option key={adv.beneficiario} value={adv.beneficiario}>
                  {adv.beneficiario}
                </option>
              ))}
            </Select>
            {errors.beneficiario?.message && <Text color="red.500" fontSize="sm">{errors.beneficiario.message.toString()}</Text>}
          </GridItem>
          <GridItem colSpan={[12, 6]}>
            <Text mb="2">Endereço</Text>
            <Input {...register('endereco')} />
            {errors.endereco?.message && <Text color="red.500" fontSize="sm">{errors.endereco.message.toString()}</Text>}
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <Text mb="2">Nome do Cliente</Text>
            <Input {...register('nomeCliente')} />
            {errors.nomeCliente?.message && <Text color="red.500" fontSize="sm">{errors.nomeCliente.message.toString()}</Text>}
          </GridItem>
          <GridItem colSpan={[12, 6]}>
            <Text mb="2">CEP</Text>
            <Input {...register('cep')} />
            {errors.cep?.message && <Text color="red.500" fontSize="sm">{errors.cep.message.toString()}</Text>}
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <Text mb="2">CNPJ</Text>
            <Input {...register('cnpj')} />
            {errors.cnpj?.message && <Text color="red.500" fontSize="sm">{errors.cnpj.message.toString()}</Text>}
          </GridItem>
          <GridItem colSpan={[12, 6]}>
            <Text mb="2">Nº do Contrato</Text>
            <Input {...register('numeroContrato')} />
            {errors.numeroContrato?.message && <Text color="red.500" fontSize="sm">{errors.numeroContrato.message.toString()}</Text>}
          </GridItem>

          <GridItem colSpan={[12, 3]}>
            <Text mb="2">Parcelas</Text>
            <Input type="number" {...register('parcelas')} />
            {errors.parcelas?.message && <Text color="red.500" fontSize="sm">{errors.parcelas.message.toString()}</Text>}
          </GridItem>
          <GridItem colSpan={[12, 3]}>
            <Text mb="2">Valor</Text>
            <Input type="number" {...register('valor')} />
            {errors.valor?.message && <Text color="red.500" fontSize="sm">{errors.valor.message.toString()}</Text>}
          </GridItem>
          <GridItem colSpan={[12, 6]}>
            <Text mb="2">Data</Text>
            <Input type="date" {...register('data')} />
            {errors.data?.message && <Text color="red.500" fontSize="sm">{errors.data.message.toString()}</Text>}
          </GridItem>
        </Grid>

        <Button mt="20px" type="submit" colorScheme="teal" width="full">
          Gerar Recibo
        </Button>
      </Box>
    </>
  );
};

export default Formulario;
