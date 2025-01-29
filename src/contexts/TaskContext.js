import React, {createContext, useState, useContext} from 'react';
import {Alert} from 'react-native';

const TaskContext = createContext();

export const TaskProvider = ({children}) => {
  const [tasks, setTasks] = useState([]);

  const addTask = task => {
    try {
      const newTask = {
        id: Date.now().toString(),
        ...task,
        createdAt: new Date().toISOString(),
        subtasks: task.subtasks || [],
        completed: false,
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (error) {
      Alert.alert('Hata', 'Görev eklenirken bir hata oluştu');
    }
  };

  const updateTask = (id, updatedTask) => {
    try {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? {...task, ...updatedTask} : task,
        ),
      );
    } catch (error) {
      Alert.alert('Hata', 'Görev güncellenirken bir hata oluştu');
    }
  };

  const deleteTask = id => {
    try {
      Alert.alert('Onay', 'Bu görevi silmek istediğinizden emin misiniz?', [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          onPress: () => {
            setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
          },
          style: 'destructive',
        },
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Görev silinirken bir hata oluştu');
    }
  };

  const toggleTaskComplete = id => {
    try {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? {...task, completed: !task.completed} : task,
        ),
      );
    } catch (error) {
      Alert.alert('Hata', 'Görev durumu güncellenirken bir hata oluştu');
    }
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
