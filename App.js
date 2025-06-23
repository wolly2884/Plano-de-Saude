import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';

import { createStackNavigator } from '@react-navigation/stack';

// Importando as telas
import BemVindo from './screens/BemVindo/BemVindo.js';
import Home from './screens/Main/Home/index';
import Login from './screens/LoginScreen/index';
import Cadastro from './screens/Signup/index';
import RecuperarSenha from './screens/ForgotPassword/index';
import Pages from './screens/Main/MainScreen/navigation/index';

import CarterinhaVirtual from './screens/Main/MainScreen/Utils/Carteirinha/index_frente';
import CarterinhaVerso from './screens/Main/MainScreen/Utils/Carteirinha/index_Verso';
import GerarToken from './screens/Main/MainScreen/Utils/GerarToken/index';
import ViaBoleto from './screens/Main/MainScreen/Utils/ViaBoleto/index';
import RedeCredenciada from './screens/Main/MainScreen/Utils/RedeCredenciada/index';
import Contato from './screens/Main/MainScreen/Utils/contato/index';
import Alarme from './screens/Main/MainScreen/Utils/Alarme/index';
import Noticias from './screens/Main/MainScreen/Utils/Noticia/index';
import ChatBot from './screens/Main/MainScreen/Utils/ChatBot/chatbot';
import Chatmessage from './screens/Main/MainScreen/Utils/ChatBot/chatmessage';
import Manuais from './screens/Main/MainScreen/Utils/Manuais/app';
import AlterSenha from './screens/Main/MainScreen/Utils/AlterSenha/app';
import AlterCad from './screens/Main/MainScreen/Utils/AlterCadastro/app';
import AlterEmail from './screens/Main/MainScreen/Utils/AlterEmail/app';

import GeraImpRenda from './screens/Main/MainScreen/Utils/IRPF/app';
import Irpf from './screens/Main/MainScreen/Utils/IRPF/irpf';
import Extrafin from './screens/Main/MainScreen/Utils/ExtraFin/index';
import boleto from './screens/Main/MainScreen/Utils/ExtraFin/boleto';

import Dependente from './screens/Main/MainScreen/Utils/InputDependente/index';
import Agendamento from './screens/Main/MainScreen/Utils/Agendamento/index';
import schedule from './screens/Main/MainScreen/Utils/Agendamento/Agenda';
import Receita from './screens/Main/MainScreen/Utils/Medicamentos/Receita';
import Medicamentos from './screens/Main/MainScreen/Utils/Medicamentos/index';
import PDF from './screens/Main/MainScreen/Utils/Medicamentos/ViewPdf';
import Setting from './screens/Main/MainScreen/Utils/Settings/Settings';

// Importando as novas telas
import AcessoNegado from './screens/Main/MainScreen/Utils/AcessoNegado/AcessoNegado';
import Suporte from './screens/Main/MainScreen/Utils/AcessoNegado/Suporte';

const Stack = createStackNavigator();

const ThemedStack = () => {
  const { theme, isNightMode } = useTheme();
  const navigationTheme = isNightMode ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <MenuProvider style={{ backgroundColor: theme.backgroundColor }}>
        <Stack.Navigator>
          <Stack.Screen name="Bem-Vindo" component={BemVindo} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="pagina" component={Pages} options={{ headerShown: false }} />
          <Stack.Screen name="Logout" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Recuperar Senha" component={RecuperarSenha} options={{ headerShown: true }} />

          {/* Telas de utilitários e principais */}
          <Stack.Screen name="Carterinha Virtual" component={CarterinhaVirtual} options={{ headerShown: true }} />
          <Stack.Screen name="Carterinha Verso" component={CarterinhaVerso} options={{ headerShown: true }} />
          <Stack.Screen name="Gerar Token" component={GerarToken} options={{ headerShown: true }} />
          <Stack.Screen name="Alarmes" component={Alarme} options={{ headerShown: true }} />
          <Stack.Screen name="Noticias" component={Noticias} options={{ headerShown: true }} />
          <Stack.Screen name="Rede Credenciada" component={RedeCredenciada} options={{ headerShown: true }} />
          <Stack.Screen name="Contato" component={Contato} options={{ headerShown: true }} />
          <Stack.Screen name="Via Boleto" component={ViaBoleto} options={{ headerShown: true }} />
          <Stack.Screen name="Manuais" component={Manuais} options={{ headerShown: true }} />
          <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: true }} />
          <Stack.Screen name="Atendimento ao Cliente" component={ChatBot} options={{ headerShown: true }} />
          <Stack.Screen name="Chat Live" component={Chatmessage} options={{ headerShown: true }} />
          <Stack.Screen name="Agendamento" component={Agendamento} options={{ headerShown: true }} />
          <Stack.Screen name="Agenda" component={schedule} options={{ headerShown: true }} />
          <Stack.Screen name="Receita" component={Receita} options={{ headerShown: true }} />
          <Stack.Screen name="Medicamentos" component={Medicamentos} options={{ headerShown: true }} />
          <Stack.Screen name="Bulario" component={PDF} options={{ headerShown: true }} />
          <Stack.Screen name="Imposto de Renda" component={GeraImpRenda} options={{ headerShown: true }} />
          <Stack.Screen name="Irpf" component={Irpf} options={{ headerShown: true }} />
          <Stack.Screen name="Extrato Financerio" component={Extrafin} options={{ headerShown: true }} />
          <Stack.Screen name="Boleto" component={boleto} options={{ headerShown: true }} />
          <Stack.Screen name="Alteração de Dados" component={AlterCad} options={{ headerShown: true }} />
          <Stack.Screen name="Alteração da Senha" component={AlterSenha} options={{ headerShown: true }} />
          <Stack.Screen name="Alteração do Email" component={AlterEmail} options={{ headerShown: true }} />
          <Stack.Screen name="Inclusão de Dependente" component={Dependente} options={{ headerShown: true }} />
          <Stack.Screen name="Configurações" component={Setting} options={{ headerShown: true }} />

          {/* Novas telas */}
          <Stack.Screen name="AcessoNegado" component={AcessoNegado} options={{ headerShown: false }} />
          <Stack.Screen name="Suporte" component={Suporte} options={{ title: 'Suporte', headerShown: true }} />
        </Stack.Navigator>
      </MenuProvider>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ThemedStack />
    </ThemeProvider>
  );
}
