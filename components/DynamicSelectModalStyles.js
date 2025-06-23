import React from 'react';
import {  StyleSheet,  Platform } from 'react-native';

export const getStyles = (theme) => StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    backgroundColor: theme.modalBackground,
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '60%',
    ...Platform.select({
      android: { elevation: 10 },
      ios: { shadowColor: theme.shadowColor, shadowOpacity: 0.2, shadowRadius: 8 },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: theme.modalTextColor,
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  rowPressed: {
    backgroundColor: theme.isNightMode ? '#333' : '#f0f0f0',
  },
  rowSelected: {
    backgroundColor: theme.isNightMode ? '#444' : '#e6f7ff',
  },
  rowText: {
    fontSize: 16,
    color: theme.modalTextColor,
  },
  rowTextSelected: {
    fontWeight: 'bold',
    color: theme.linkColor,
  },
  separator: {
    height: 1,
    backgroundColor: theme.isNightMode ? '#444' : '#eee',
    marginVertical: 4,
  },
});
