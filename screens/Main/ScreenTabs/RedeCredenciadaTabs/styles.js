import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// helpers rápidos ― evitam instalar libs externas
const wp = pct => (width * pct) / 100;   // width‐percent
const hp = pct => (height * pct) / 100;  // height‐percent

export const styles = StyleSheet.create({
  /* ---------- container geral ---------- */
  container: {
    flex: 1,
    backgroundColor: '#666',
  },

  /* ---------- footer ---------- */
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#333',
    paddingVertical: hp(1.3),  // ~1,3 % da altura
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* mesmo estilo se quiser manter o "footerPortal" */
  footerPortal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#333',
    paddingVertical: hp(1.3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: wp(3.5), // 3,5 % da largura ≈ 14‑16 px em celulares médios
    color: '#fff',
  },

  content: {
    flex: 1,
  },

  /* ---------- Rede Credenciada ---------- */
  /* mapa ocupa todo o espaço disponível */
  RCmap: { flex: 1 },

  /* quando precisa “reservar” espaço p/ o footer,
     basta reduzir a altura em % (ex.: 88 % da tela) */
  RCmapf: {
    width: '100%',
    height: hp(88),  // ocupa 88 % da altura da tela
    marginTop: hp(0.4),
    marginBottom: hp(4.5), // deixa espaço p/ footer em qualquer device
  },

  /* botão/flutuante “Buscar Hospitais” */
  RCTexto: {
    fontSize: wp(4.8),            // ~18‑20 px
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#0d729c',
    fontWeight: 'bold',
    paddingVertical: hp(1.1),
    paddingHorizontal: wp(4),
    borderRadius: 6,
    /* posicionamento absoluto, mas com % para não “sumir” em tablets */
    position: 'absolute',
    right: wp(5),
    bottom: hp(15),               // 15 % acima do rodapé
    /* sombra (iOS) + elevação (Android) p/ destacar */
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 4 },
    }),
  },

  /* container que agrupa o botão (se preferir sem absoluto) */
  RCsearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    /* removed fixed top/right; se precisar usar absoluto, use pct:
       position:'absolute', top: hp(8), right: wp(10) */
  },

  /* margem também relativa */
  RCbusca: {
    marginTop: hp(2.5),
  },
});
