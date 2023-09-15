import React, {useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Data} from './data';
import moment from 'moment';
import Swipeable from 'react-native-gesture-handler/Swipeable';
const {width, height} = Dimensions.get('screen');
import {DefText} from '../../common/BOOTSTRAP';

const RenderRight = (progress, dragX) => {
  //console.log('dragX:::', dragX);

  return (
    <TouchableOpacity
      onPress={() => Alert.alert('delete!!')}
      style={{
        width: 80,

        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Animated.Text style={[{color: '#fff', fontWeight: '600'}]}>
        Delete
      </Animated.Text>
    </TouchableOpacity>
  );
};

const RenderLeft = (progress, dragX) => {
  const scale = dragX.interpolate({
    inputRange: [0.5, 50],
    outputRange: [0.1, 1],
  });

  const Style = {
    transform: [
      {
        scale,
      },
    ],
  };

  return (
    <View
      style={{
        width: 80,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Animated.Text style={[Style, {color: '#fff', fontWeight: '600'}]}>
        Like
      </Animated.Text>
    </View>
  );
};

const RenderItem = ({item, index, deleteItem, likeItem}) => {
  return (
    <Swipeable
      useNativeAnimations
      //overshootLeft={false}
      //onSwipeableLeftOpen={() => likeItem(item.id)}
      //renderLeftActions={RenderLeft}
      overshootRight={false}
      //onSwipeableRightOpen={() => deleteItem(item.id)}
      renderRightActions={RenderRight}>
      <View style={styles.item}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '20%',
          }}>
          <Text style={{fontWeight: '600'}}>{item.name}</Text>
          <Text style={{fontSize: 12}}>{item.likes || 0}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 5,
          }}>
          <Text>{item.Message}</Text>
          <Text>{moment(item.timeStamp).format('LT')}</Text>
        </View>
      </View>
    </Swipeable>
  );
};

const LikeDisplayer = () => {
  return (
    <View style={[styles.likeDisplayer]}>
      <DefText text="like" />
      {/* <FontAwesome name="heart" color="red" size={200} /> */}
    </View>
  );
};

export default function NoticeLists() {
  const [data, setData] = useState(Data);
  const [displayerVisible, setDisplayerVisible] = useState(false);

  const deleteItem = id => {
    const temp = data.filter(item => item.id !== id);
    setData(temp);
  };

  const likeItem = id => {
    setDisplayerVisible(true);

    const currentItem = data.find(item => item.id == id);
    const updatedItem = {
      ...currentItem,
      likes: currentItem.likes ? currentItem.likes + 1 : 1,
    };

    const temp = data.map(item =>
      item.id == currentItem.id ? updatedItem : item,
    );

    setData(temp);

    setTimeout(() => {
      setDisplayerVisible(false);
    }, 400);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      {displayerVisible ? <LikeDisplayer /> : null}
      <FlatList
        style={{flex: 1}}
        contentContainerStyle={{flex: 1}}
        data={data}
        ListEmptyComponent={() => (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>NO ITEMS TO DISPLAY</Text>
          </View>
        )}
        renderItem={({item, index}) => (
          <RenderItem
            item={item}
            index={index}
            deleteItem={deleteItem}
            likeItem={likeItem}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    //borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  likeDisplayer: {
    position: 'absolute',
    zIndex: 100000,
    left: '20%',
    top: '35%',
  },
});
