import { cpf } from 'cpf-cnpj-validator';

// Função para formatar CPF (ex.: 123.456.789-00)
export const formatCPF = (value) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  if (cleaned.length === 0) return '';
  return cleaned
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

// Função para formatar celular (ex.: (11) 91234-5678)
export const formatCelular = (value) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  if (cleaned.length === 0) return '';
  return cleaned
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

// Função para formatar CEP (ex.: 12345-678)
export const formatCEP = (value) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 8);
  if (cleaned.length === 0) return '';
  return cleaned.replace(/(\d{5})(\d)/, '$1-$2');
};

// Função para formatar data (ex.: 12/12/2025)
export const formatDate = (value) => {
 
  // Se já estiver no formato brasileiro, retorna como está
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;

  if ( value.length > 10){
    const partes = value.slice(0,10).split('-');
    console.log('partes', partes)
  if (partes.length !== 3) return value;

  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
  } 

  // Remove todos os caracteres não numéricos e limita a 8 dígitos
  const cleaned = value.replace(/\D/g, '').slice(0, 8);
  if (cleaned.length === 0) return '';

  // Formata a entrada diretamente como DD/MM/YYYY
  let formatted = cleaned;
  if (cleaned.length > 2) {
    formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  }
  if (cleaned.length > 4) {
    formatted = formatted.slice(0, 5) + '/' + formatted.slice(5);
  }

  return formatted;
};

// Função para validar e formatar datas (DD/MM/YYYY -> YYYY-MM-DD)
export const validateAndFormatDate = (dateStr, fieldName, setFormErrors) => {
  if (!dateStr) {
    setFormErrors((prev) => ({ ...prev, [fieldName]: true }));
    return null;
  }

  // Verifica se a data está no formato DD/MM/YYYY
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    setFormErrors((prev) => ({ ...prev, [fieldName]: true }));
    return null;
  }

  const [_, day, month, year] = match;
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  // Validações básicas
  if (
    monthNum < 1 || monthNum > 12 ||
    dayNum < 1 || dayNum > 31 ||
    yearNum < 1900 || yearNum > new Date().getFullYear()
  ) {
    setFormErrors((prev) => ({ ...prev, [fieldName]: true }));
    return null;
  }

  // Validação de dias por mês (ex.: fevereiro, anos bissextos)
  const date = new Date(yearNum, monthNum - 1, dayNum);
  if (
    date.getDate() !== dayNum ||
    date.getMonth() + 1 !== monthNum ||
    date.getFullYear() !== yearNum
  ) {
    setFormErrors((prev) => ({ ...prev, [fieldName]: true }));
    return null;
  }

  // Formata para YYYY-MM-DD
  return `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
};

// Função para validar todos os campos do formulário
export const validateFields = (formData, setFormErrors) => {
  const errors = {};
  const requiredFields = [
    'nmBeneficiario',
    'age',
    'estadoCivil',
    'sexo',
    'celular',
    'logradouro',
    'numero',
    'cidade',
    'CEP',
    'estado',
    'CNS',
  ];

  requiredFields.forEach((field) => {
    if (!formData[field]) {
      errors[field] = true;
    }
  });

  if (formData.password && formData.password.length < 6) {
    errors.password = true;
  }
  if (formData.Email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.Email)) {
    errors.Email = true;
  }
  if (formData.celular && formData.celular.replace(/\D/g, '').length < 11) {
    errors.celular = true;
  }
  if (formData.CEP && formData.CEP.replace(/\D/g, '').length !== 8) {
    errors.CEP = true;
  }
  if (formData.CNS && formData.CNS.replace(/\D/g, '').length !== 15) {
    errors.CNS = true;
  }
  if (formData.sexo && !['M', 'F'].includes(formData.sexo.toUpperCase())) {
    errors.sexo = true;
  }
  if (formData.estado && formData.estado.length !== 2) {
    errors.estado = true;
  }

  console.log('errors', errors)

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};