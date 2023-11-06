// App.tsx
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import AppleHealthKit, {HealthValue} from 'react-native-health';
import HealthData from './Healthdata';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const App = () => {
  const [heartRate, setHeartRate] = useState<any>();
  const [stepCount, setStepCount] = useState<any>();
  const [activeEngy, setActiveEngy] = useState<any>();
  const [bloodSat, setBloodSat] = useState<any>();

  const fetchData = () => {
    // Define options for data retrieval
    const options = {
      startDate: '2023-11-05T18:30:00.000Z',  
      // if the data is not coming, tryna do tweak with above date,
      // somewhere they have time limit exceptions
    };

    // // Retrieve Heart Rate data
    AppleHealthKit.getHeartRateSamples(
      {startDate: '2023-11-05T18:30:00.000Z'},
      (error: string, heartRateResults: HealthValue[]) => {
        if (!error) {
          setHeartRate(heartRateResults);

          console.log(options, 'Heart Rate Data: ', heartRateResults);
        }
      },
    );

    // // Retrieve Step count data
    AppleHealthKit.getStepCount(
      options,
      (error: string, stepCountResults: HealthValue) => {
        if (!error) {
          setStepCount(stepCountResults);
          console.log('Step Count Data:', stepCountResults);
        }
      },
    );

    // // need to calculate energy burned
    AppleHealthKit.getActiveEnergyBurned(
      options,
      (error: string, results: Array<HealthValue>) => {
        if (!error) {
          setActiveEngy(results);
          console.log('Active Energy Burned Data:', results);
        }
      },
    );

    // AppleHealthKit.getOxygenSaturationSamples(
    //   options,
    //   (callbackError: Object, results: Array<HealthValue>) => {
    //     if (callbackError) {
    //       console.log('oxy sat Error---', callbackError);
    //     }
    //     setBloodSat(results);
    //     console.log('this is oxygen saturation --<', results);
    //   },
    // );
  };

  return (
    <View style={{flex: 1}}>
      <HealthData
        onUpdateData={fetchData}
        heartRate={heartRate}
        stepCount={stepCount}
        activeEngy={activeEngy}
        bloodSat={bloodSat}
        setHeartRate={setHeartRate}
        setStepCount={setStepCount}
        setActiveEngy={setActiveEngy}
        setBloodSat={setBloodSat}
      />
      <View
        style={{
          backgroundColor: 'limegreen',
          padding: 10,
        }}>
        <Text>RESULTS: </Text>
        <View
          style={{
            borderRadius: 10,
            backgroundColor: 'aliceblue',
            width: wp(80),
            justifyContent: 'center',
          }}>
          <View style={{paddingHorizontal: 15}}>
            <Text>HeartRate : {JSON.stringify(heartRate)}</Text>
            <Text>StepCount : {JSON.stringify(stepCount)}</Text>
            <Text>ActiveEnergy: {JSON.stringify(activeEngy)}</Text>
            <Text>BloodSaturation: {JSON.stringify(bloodSat)}</Text>
          </View>
          {/* <Icon name='plus' color='red' size={26} /> */}
          {/* {myIcon} */}
        </View>
      </View>
    </View>
  );
};

export default App;
