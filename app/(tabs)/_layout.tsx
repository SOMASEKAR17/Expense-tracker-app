import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
  screenOptions={{
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarBackground: undefined, // disable blur background for now
    tabBarActiveTintColor: "#2563EB", // blue for active
    tabBarInactiveTintColor: "#9CA3AF", // gray for inactive
    tabBarStyle: {
      backgroundColor: "#ffffff", // solid white
      borderTopWidth: 0.5,
      borderTopColor: "#E5E7EB",
      height: 60,
      paddingBottom: 10,
      paddingTop: 3,
      elevation: 10, // Android shadow
      shadowColor: "#000", // iOS shadow
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
  }}
>
  <Tabs.Screen
    name="index"
    options={{
      title: "Dashboard",
      tabBarIcon: ({ color }) => (
        <IconSymbol size={24} name="chart.bar.fill" color={color} />
      ),
    }}
  />
  <Tabs.Screen
    name="add-transaction"
    options={{
      title: "Add",
      tabBarIcon: ({ color }) => (
        <IconSymbol size={24} name="plus.circle.fill" color={color} />
      ),
    }}
  />
  <Tabs.Screen
    name="banks"
    options={{
      title: "Banks",
      tabBarIcon: ({ color }) => (
        <IconSymbol size={24} name="building.2.fill" color={color} />
      ),
    }}
  />
  <Tabs.Screen
    name="categories"
    options={{
      title: "Categories",
      tabBarIcon: ({ color }) => (
        <IconSymbol size={24} name="tag.fill" color={color} />
      ),
    }}
  />
</Tabs>

  );
}
