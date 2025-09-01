import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  // For now, redirect to login
  // Later this will check authentication status and redirect accordingly
  return <Redirect href="/(auth)/login" />;
} 