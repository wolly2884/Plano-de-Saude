 /**
 * Utilitários para manipulação de datas
 */
 const dateUtils = {
    // Retorna a data atual no formato YYYY-MM-DD
    getFormattedDate: () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  
    // Formata uma data específica no formato desejado
    formatDate: (date = new Date(), format = 'YYYY-MM-DD') => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
  
      return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
    },
  
    // Adiciona dias a uma data
    addDays: (date = new Date(), days = 0) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },
  
    // Subtrai dias de uma data
    subtractDays: (date = new Date(), days = 0) => {
      const result = new Date(date);
      result.setDate(result.getDate() - days);
      return result;
    },
  
    // Verifica se uma data é válida
    isValidDate: (date) => {
      return date instanceof Date && !isNaN(date);
    },
  
    // Calcula a diferença em dias entre duas datas
    getDaysDifference: (date1, date2) => {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const diffTime = Math.abs(d2 - d1);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
  
    // Retorna o nome do mês
    getMonthName: (monthNumber) => {
      const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      return months[monthNumber - 1] || '';
    },
  
    // Função para obter o mês atual no formato abreviado
    getCurrentMonthshort: (currentMonthIndex) => {
      const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      return monthNames[currentMonthIndex];
    },
    
     // Retorna o nome do mês
    getMonth: () => {
      const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      return months;
    },
  
    //Retorna os meses do ano
    getmonthNamesShort: () => {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return months;
    },
  
     //Retorna dias da semana -> short
    getdayNamesShort: () => {
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      return days;
    },
  
     //Retorna dias da semana
    getdayNames: () => {
      const weeks = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      return weeks;
    }
  
  };
  
  export default dateUtils;