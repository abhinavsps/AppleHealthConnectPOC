// HealthData.tsx
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Button} from 'react-native';
import AppleHealthKit, {
  HealthKitPermissions,
  HealthValue,
} from 'react-native-health';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

interface HealthDataProps {
  onUpdateData: () => void;
  heartRate: any;
  stepCount: any;
  activeEngy: any;
  bloodSat: any;
  setHeartRate: (value: any) => void;
  setStepCount: (value: any) => void;
  setActiveEngy: (value: any) => void;
  setBloodSat: (value: any) => void;
}

const HealthData: React.FC<HealthDataProps> = ({
  onUpdateData,
  heartRate,
  stepCount,
  activeEngy,
  bloodSat,
  setHeartRate,
  setStepCount,
  setActiveEngy,
  setBloodSat,
}) => {
  const [heartRateInput, setHeartRateInput] = useState<string>('');
  const [stepCountInput, setStepCountInput] = useState<string>('');
  const [activeEngyInput, setActiveEngyInput] = useState<string>('');

  const permissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.HeartRate,
        AppleHealthKit.Constants.Permissions.Steps,
        AppleHealthKit.Constants.Permissions.Workout,
        AppleHealthKit.Constants.Permissions.OxygenSaturation,
      ],
      write: [
        AppleHealthKit.Constants.Permissions.HeartRate,
        AppleHealthKit.Constants.Permissions.Steps,
        AppleHealthKit.Constants.Permissions.Workout,
        AppleHealthKit.Constants.Permissions.OxygenSaturation,
        // ... other write permissions
      ],
    },
  } as HealthKitPermissions;

  useEffect(() => {
    // Initialize HealthKit and request permissions
    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        console.log('Error initializing HealthKit:', error);
      } else {
        console.log('HealthKit permissions granted.');
        // You can now save data to HealthKit.
        syncData();
      }
    });
  }, []);

  const syncData = () => {
    const updatedHeartRate = parseFloat(heartRateInput);
    if (!isNaN(updatedHeartRate)) {
      setHeartRate(updatedHeartRate);
      // Update Heart Rate data in Apple HealthKit
      const heartRateData = {
        value: updatedHeartRate, // Updated heart rate value
        date: new Date().toISOString(), // Current date and time
      };
      AppleHealthKit.saveHeartRateSample(heartRateData, (error: string) => {
      if (!error) {
        console.log('Heart Rate data updated in Apple HealthKit.');
        } else {
          console.error('Error updating Heart Rate data:', error);
        }
      });
    }

    const updatedStepCount = parseFloat(stepCountInput);
    if (!isNaN(updatedStepCount)) {
      setStepCount(updatedStepCount);
      // console.log('this is step rate: ', updatedStepCount);
      // Update Step Count data in Apple HealthKit
      const stepCountData = {
        value: updatedStepCount, // Updated step count value
        startDate: new Date().toISOString(), // Current date and time
        endDate: new Date().toISOString(), // Current date and time
      };

      AppleHealthKit.saveSteps(stepCountData, (error: string) => {
        if (!error) {
          console.log('Step Count data updated in Apple HealthKit.');
        } else {
          console.error('Error updating Step Count data:', error);
        }
      });
    }

    const updatedActiveEngy = parseFloat(activeEngyInput);
    if (!isNaN(updatedActiveEngy)) {
      setActiveEngy(updatedActiveEngy);
      // console.log('this is active energy rate: ', updatedActiveEngy);

      const activeEnergyData = {
        energyBurned: Number(updatedActiveEngy), // Updated active energy burned value
        type: String('Walking'), // See HealthActivity Enum,
        energyBurnedUnit: 'calories',
        distance: 50, // In Distance unit
        distanceUnit: 'meter',
        startDate: new Date(2023, 11, 5).toISOString(),
        endDate: new Date(2023, 11, 6, 12, 42, 5).toISOString(), // Adjusted endDate
      };

      AppleHealthKit.saveWorkout(activeEnergyData, (error: string) => {
        if (!error) {
          console.log('Active Energy Burned data updated in Apple HealthKit.');
        } else {
          console.error('Error updating Active Energy Burned data:', error);
        }
      });
    }

    // Trigger data refresh
    onUpdateData();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
      }}>
      <View
        style={{
          height: hp(10),
          width: wp(80),
          marginVertical: 10,
          padding: 10,
          justifyContent: 'space-between',
          borderWidth: 1,
          borderRadius: 10,
          flexDirection: 'column',
        }}>
        <View>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            Heart Rate (BPM)
          </Text>
          <TextInput
            placeholder="Enter heart rate"
            onChangeText={text => setHeartRateInput(text)}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View
        style={{
          height: hp(10),
          width: wp(80),
          marginVertical: 10,
          padding: 10,
          justifyContent: 'space-between',
          borderWidth: 1,
          borderRadius: 10,
        }}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Step Count</Text>
        <TextInput
          placeholder="Enter step count"
          onChangeText={text => setStepCountInput(text)}
          keyboardType="numeric"
        />
      </View>
      <View
        style={{
          height: hp(14),
          width: wp(80),
          marginVertical: 10,
          padding: 10,
          justifyContent: 'space-between',
          borderWidth: 1,
          borderRadius: 10,
        }}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          Active Energy Burned {'\n'}(calories)
        </Text>
        <TextInput
          placeholder="Enter active energy burned"
          onChangeText={text => setActiveEngyInput(text)}
          keyboardType="numeric"
        />
      </View>
      <View
        style={{
          height: hp(10),
          width: wp(80),
          marginVertical: 10,
          padding: 10,
          justifyContent: 'space-between',
          borderWidth: 1,
          borderRadius: 10,
        }}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          Blood Saturation Level
        </Text>
        <View>
          <Text>{bloodSat}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={syncData}
        style={{
          borderRadius: 10,
          height: 50,
          width: 100,
          backgroundColor: 'lightblue',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontWeight: 'bold'}}>Sync Now!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HealthData;
