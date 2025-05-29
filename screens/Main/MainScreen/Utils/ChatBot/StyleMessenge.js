
// styles.js
import { StyleSheet, Platform } from 'react-native';

export const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.placeholderColor, // Default to white for light theme
  },
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.placeholderColor,
  },
  introAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#2563EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.backgroundColor,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textColor,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  messageContainer: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 10,
    marginVertical: 4,
  },
  clientMessage: {
    backgroundColor: '#DBEAFE',
    alignSelf: 'flex-end',
  },
  adminMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  sender: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#1F2937',
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D4ED8',
    padding: 6,
    borderRadius: 8,
    marginTop: 8,
  },
  attachmentText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 6,
  },
  downloadText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundColor,

    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 10,
    color: '#111827',
    width: '75%',
  },
  focusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    position: 'absolute', // Make sendButton position absolute to control bottom
    right: 10, // Adjust to align with other buttons
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 20,
  },
  handlePickFile : {
    marginRight: 10,
    position: 'absolute',
    right: 50,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 70,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});