import React                    from 'react';

// Menu
import { NavigationContainer }  from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MenuProvider }         from 'react-native-popup-menu';

// Pages
import Home               from './screens/Main/Home/index';
import Login              from './screens/LoginScreen/index'
import Cadastro           from './screens/Signup/index'
import RecuperarSenha     from './screens/ForgotPassword/index'
import BemVindo           from './screens/BemVindo/BemVindo.js'

// internas
import Pages              from './screens/Main/MainScreen/navigation/index'

//MainScreen
import CarterinhaVirtual  from './screens/Main/MainScreen/Utils/Carteirinha/index_frente'
import CarterinhaVerso    from './screens/Main/MainScreen/Utils/Carteirinha/index_Verso'
import GerarToken         from './screens/Main/MainScreen/Utils/GerarToken/index'
import ViaBoleto          from './screens/Main/MainScreen/Utils/ViaBoleto/index'
import RedeCredenciada    from './screens/Main/MainScreen/Utils/RedeCredenciada/index'
import Contato            from './screens/Main/MainScreen/Utils/contato/index'
import Alarme             from './screens/Main/MainScreen/Utils/Alarme/index'
import Noticias           from './screens/Main/MainScreen/Utils/Noticia/index'
import ChatBot            from './screens/Main/MainScreen/Utils/ChatBot/chatbot'
import Manuais            from './screens/Main/MainScreen/Utils/Manuais/app'
import AlterSenha         from './screens/Main/MainScreen/Utils/AlterSenha/app'
import AlterCad           from './screens/Main/MainScreen/Utils/AlterCadastro/app'
import GeraImpRenda       from './screens/Main/MainScreen/Utils/IRPF/app'
import Extrafin           from './screens/Main/MainScreen/Utils/ExtraFin/index'
import ExtraCopart        from './screens/Main/MainScreen/Utils/ExtraCopart/index'
import ExtraUtil          from './screens/Main/MainScreen/Utils/ExtraUtil/index'
import Dependente         from './screens/Main/MainScreen/Utils/InputDependente/index'
import Agendamento        from './screens/Main/MainScreen/Utils/Agendamento/index'
import schedule           from './screens/Main/MainScreen/Utils/Agendamento/Agenda'
import Receita            from './screens/Main/MainScreen/Utils/Medicamentos/Receita'
import Medicamentos       from './screens/Main/MainScreen/Utils/Medicamentos/index'
import PDF                from './screens/Main/MainScreen/Utils/Medicamentos/ViewPdf'

//HomeScreenTabs
import NoticiasTabs         from './screens/Main/ScreenTabs/NoticiasTabs/index'
import PlanosTabs           from './screens/Main/ScreenTabs/PlanosTabs/index'
import RedeCredenciadaTabs  from './screens/Main/ScreenTabs/RedeCredenciadaTabs/index'

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <MenuProvider style={{ backgroundColor: '#fff' }}>
        <Stack.Navigator>
          
          <Stack.Screen name="Bem-Vindo"              component={BemVindo}            options={{ headerShown: false }} />
          <Stack.Screen name="Home"                   component={Home}                options={{ headerShown: false }} />
          <Stack.Screen name="login"                  component={Login}               options={{ headerShown: false }} />
          <Stack.Screen name="pagina"                 component={Pages}               options={{ headerShown: false }} />
          <Stack.Screen name="Logout"                 component={Home}                options={{ headerShown: false }} />
          <Stack.Screen name="Recuperar Senha"        component={RecuperarSenha}      options={{ headerShown: true  }} />
    
          <Stack.Screen name="Carterinha Virtual"     component={CarterinhaVirtual}   options={{ headerShown: true  }} />
          <Stack.Screen name="Carterinha Verso"       component={CarterinhaVerso}     options={{ headerShown: true  }} />
          <Stack.Screen name="Gerar Token"            component={GerarToken}          options={{ headerShown: true  }} />
          <Stack.Screen name="Alarmes"                component={Alarme}              options={{ headerShown: true  }} />
          <Stack.Screen name="Noticias"               component={Noticias}            options={{ headerShown: true  }} />       
          <Stack.Screen name="Rede Credenciada"       component={RedeCredenciada}     options={{ headerShown: true  }} />
    
          <Stack.Screen name="Contato"                component={Contato}             options={{ headerShown: true  }} />    
          <Stack.Screen name="Via Boleto"             component={ViaBoleto}           options={{ headerShown: true  }} />
          <Stack.Screen name="Manuais"                component={Manuais}             options={{ headerShown: true  }} />
          <Stack.Screen name="Cadastro"               component={Cadastro}            options={{ headerShown: true  }} />
          <Stack.Screen name="Atendimento ao Cliente" component={ChatBot}             options={{ headerShown: true  }} /> 
          <Stack.Screen name="Agendamento"            component={Agendamento}         options={{ headerShown: true  }} />
          <Stack.Screen name="Agenda"                 component={schedule}            options={{ headerShown: true  }} />  
          <Stack.Screen name="Receita"                component={Receita}             options={{ headerShown: true  }} />    
          <Stack.Screen name="Medicamentos"           component={Medicamentos}        options={{ headerShown: true  }} />    
          <Stack.Screen name="View PDF"               component={PDF}                 options={{ headerShown: true  }} />    
    
          <Stack.Screen name="Imposto de Renda"       component={GeraImpRenda}        options={{ headerShown: true  }} />
          <Stack.Screen name="Extrato Financerio"     component={Extrafin}            options={{ headerShown: true  }} />
          <Stack.Screen name="Extrato Coparticipação" component={ExtraCopart}         options={{ headerShown: true  }} />
          <Stack.Screen name="Extrato Utilização"     component={ExtraUtil}           options={{ headerShown: true  }} />
    
          <Stack.Screen name="Alteração do Dados"     component={AlterCad}            options={{ headerShown: true  }} />
          <Stack.Screen name="Alteração de Senha"     component={AlterSenha}          options={{ headerShown: true  }} />
          <Stack.Screen name="Inclusão de Dependente" component={Dependente}          options={{ headerShown: true  }} />

          <Stack.Screen name="Noticias Tabs"          component={NoticiasTabs}        options={{ headerShown: true  }} />
          <Stack.Screen name="Planos Tabs"            component={PlanosTabs}          options={{ headerShown: true  }} />
          <Stack.Screen name="Rede Credenciada Tabs"  component={RedeCredenciadaTabs} options={{ headerShown: true  }} />
          
        </Stack.Navigator>
      </MenuProvider>
    </NavigationContainer>
  );
};

export default App;
