import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "user_session";

export type Session = {
  email: string;
  userId: number;
};

export async function saveSession(session: Session | null) {
  try {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Error saving session", error);
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const result = await SecureStore.getItemAsync(SESSION_KEY);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    console.error("Error retrieving session", error);
    return null;
  }
}

export async function clearSession() {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch (error) {
    console.error("Error clearing session", error);
  }
}
