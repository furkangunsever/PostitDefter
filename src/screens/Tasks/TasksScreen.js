import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTasks} from '../../contexts/TaskContext';
import TaskCard from '../../components/TaskCard';
import {COLORS} from '../../utils/colors';

const TasksScreen = ({navigation}) => {
  const {tasks, deleteTask, toggleTaskComplete} = useTasks();
  const scaleValue = new Animated.Value(1);

  // Görevleri tamamlanma durumuna ve tarihe göre sıralayalım
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return a.completed ? 1 : -1;
  });

  const handleCreateTask = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => navigation.navigate('CreateTask'));
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="checkbox-marked-circle-outline"
        size={64}
        color={COLORS.secondary}
      />
      <Text style={styles.emptyText}>Henüz görev eklenmemiş</Text>
      <Text style={styles.emptySubText}>
        Yeni görev eklemek için + butonuna tıklayın
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedTasks}
        renderItem={({item}) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('EditTask', {task: item})}
            onDelete={deleteTask}
            onToggleComplete={toggleTaskComplete}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
      />
      <Animated.View style={{transform: [{scale: scaleValue}]}}>
        <TouchableOpacity style={styles.fab} onPress={handleCreateTask}>
          <Icon name="plus" size={24} color={COLORS.text.white} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: '50%',
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.text.secondary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default TasksScreen;
