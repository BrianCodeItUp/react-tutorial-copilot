import { useEffect } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  Switch,
} from 'react-native';
import {
  Copilot,
  CopilotItem,
  CopilotMangerProvider,
  useCopilotManger,
} from '../../src';

const InSide = () => {
  const isWeb = typeof document !== 'undefined';

  const copilotConfig = {
    test: {
      beforeNext: () => true,
      steps: [
        {
          stepId: 'test_1',
          item: (
            <CopilotItem title="第一步">
              <Text>test1</Text>
            </CopilotItem>
          ),
        },
        {
          stepId: 'test_2',
          item: (
            <CopilotItem title="第二步">
              <Text>test2</Text>
            </CopilotItem>
          ),
        },
        {
          stepId: 'test_3',
          item: (
            <CopilotItem title="第三部">
              <Text>test3</Text>
            </CopilotItem>
          ),
        },
        {
          stepId: 'test_4',
          item: (
            <CopilotItem title="第四步">
              <Text>test4</Text>
            </CopilotItem>
          ),
        },
        {
          stepId: 'test_5',
          item: (
            <CopilotItem title="第五步">
              <Text>test5</Text>
            </CopilotItem>
          ),
        },
      ],
    },
  };

  const { registerCopilotSteps, onStart } = useCopilotManger();

  useEffect(() => {
    registerCopilotSteps('test', copilotConfig.test);
  }, []);

  return isWeb ? (
    <div style={styles.container}>
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          margin: '100px 400px',
          padding: '32px',
          gap: '24px',
          border: '1px solid black',
          borderRadius: '30px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Copilot copilotId="test_1">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
              }}
            >
              <label style={{ fontSize: 28, fontWeight: 600 }}>
                請登入帳號
              </label>
              <label>請輸入您的帳號密碼</label>
            </div>
          </Copilot>

          <Copilot copilotId="test_2">
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid skyblue',
                borderRadius: 50,
                padding: 16,
                height: 50,
                width: 50,
                backgroundColor: 'white',
              }}
            >
              <label>去註冊</label>
            </div>
          </Copilot>
        </div>

        <Copilot copilotId="test_3">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '8px',
              backgroundColor: 'white',
            }}
          >
            <label>手機號碼</label>
            <div
              style={{
                padding: '10px 20px',
                border: '1px solid black',
                borderRadius: '32px',
              }}
            >
              <label>123</label>
            </div>
          </div>
        </Copilot>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <label>請輸入密碼</label>
          <div
            style={{
              padding: '10px 20px',
              border: '1px solid black',
              borderRadius: '32px',
            }}
          >
            <label>******</label>
          </div>
        </div>

        <Copilot copilotId="test_4">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: 'white',
            }}
          >
            <label style={{ color: 'red' }}>忘記密碼</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              <label>記住帳號密碼</label>
              <input type="checkbox" />
            </div>
          </div>
        </Copilot>

        <button
          style={{
            borderRadius: '32px',
            padding: '10px',
            border: '1px solid skyblue',
            backgroundColor: 'white',
            color: '#3372c4',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          登入
        </button>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
          <hr
            style={{ width: '100%', height: '1px', backgroundColor: 'gray' }}
          />
          <label>或</label>
          <hr
            style={{ width: '100%', height: '1px', backgroundColor: 'gray' }}
          />
        </div>

        <Copilot copilotId="test_5">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <button
              style={{
                flex: 1,
                borderRadius: '32px',
                padding: '10px',
                border: '1px solid black',
                backgroundColor: 'white',
                fontSize: 14,
              }}
            >
              使用生物辨識登入
            </button>
          </div>
        </Copilot>
        <button
          style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'white',
            border: 'none',
          }}
          onClick={() => onStart('test')}
        >
          <label style={{ color: 'blue', fontSize: 20 }}>開始教學</label>
        </button>
      </div>
    </div>
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 20, gap: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 20,
            justifyContent: 'space-between',
          }}
        >
          <Copilot copilotId="test_1">
            <View style={{ gap: 8, backgroundColor: 'white' }}>
              <Text style={{ fontSize: 28, fontWeight: 600 }}>請登入帳號</Text>
              <Text>請輸入您的帳號密碼</Text>
            </View>
          </Copilot>
          <Copilot copilotId="test_2">
            <View
              style={{
                height: 68,
                width: 68,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'skyblue',
                borderWidth: 1,
                backgroundColor: 'white',
              }}
            >
              <Text>去註冊</Text>
            </View>
          </Copilot>
        </View>
        <Copilot copilotId="test_3">
          <View style={{ gap: 4, backgroundColor: 'white' }}>
            <Text>手機號碼</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                height: 48,
                borderRadius: 40,
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}
            >
              <Text>123</Text>
            </View>
          </View>
        </Copilot>
        <View style={{ gap: 4 }}>
          <Text>請輸入密碼</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              height: 48,
              borderRadius: 40,
              justifyContent: 'center',
              paddingHorizontal: 20,
            }}
          >
            <Text>123</Text>
          </View>
        </View>

        <Copilot copilotId="test_4">
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'red' }}>忘記密碼了</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Text>記住帳號密碼</Text>
              <Switch />
            </View>
          </View>
        </Copilot>

        <View
          style={{
            height: 48,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 40,
            borderColor: 'skyblue',
          }}
        >
          <Text style={{ color: 'skyblue' }}>登入</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 20,
            gap: 16,
          }}
        >
          <View style={{ flex: 1, height: 0.5, borderWidth: 0.5 }} />
          <Text>或</Text>
          <View style={{ flex: 1, height: 0.5, borderWidth: 0.5 }} />
        </View>
        <Copilot copilotId="test_5">
          <View
            style={{
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: 40,
            }}
          >
            <Text>使用生物辨識登入</Text>
          </View>
        </Copilot>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Pressable onPress={() => onStart('test')}>
            <Text style={{ color: 'blue', fontSize: 20 }}>開始動畫</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <CopilotMangerProvider>
      <InSide />
    </CopilotMangerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
