import { StackScreenProps } from '@react-navigation/stack';
import { useForegroundPermissions } from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';

import { StackParamList } from '../providers/navigation';
import { Box, Button, Spinner, Title, Paragraph } from '../providers/theme';

type OnboardingScreenProps = StackScreenProps<StackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const [locationPermission, askLocationPermission] = useForegroundPermissions();
  const [notificationPermission, setNotificationPermission] = useState<Notifications.PermissionStatus | null>(null);

  const askNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationPermission(status);
  };

  const onContinue = useCallback(() => {
    navigation.navigate('Distance');
  }, [navigation]);

  useEffect(() => {
    // Check both permissions
    if (locationPermission?.granted && notificationPermission === 'granted') {
      onContinue();
    }
  }, [onContinue, locationPermission?.granted, notificationPermission]);

  useEffect(() => {
    // Request notification permission on mount
    askNotificationPermission();
  }, []);

  const renderContent = () => {
    if (locationPermission?.granted && notificationPermission === 'granted') {
      return (
        <Box>
          <Title>Permissions granted</Title>
          <Paragraph>To monitor your office marathon, we need access to your location and notifications.</Paragraph>
          <Button onPress={onContinue}>Let's start!</Button>
        </Box>
      );
    }

    return (
      <Box>
        <Title>We need your permission</Title>
        <Paragraph>To monitor your office marathon, we need access to your location and notifications.</Paragraph>
        {!locationPermission ? (
          <Spinner />
        ) : (
          <Button onPress={askLocationPermission}>Grant location permission</Button>
        )}
        {notificationPermission !== 'granted' && (
          <Button onPress={askNotificationPermission}>Grant notification permission</Button>
        )}
      </Box>
    );
  };

  return (
    <Box variant='page'>
      {renderContent()}
    </Box>
  );
};
