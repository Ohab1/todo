import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'todos';

const TodoScreen = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null); 

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    console.log("loadTodos data",data)
    if (data) {
      setTodos(JSON.parse(data));
    }
  };

  const saveTodos = async (newTodos) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
  };

  const addTodo = async () => {
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false
    };
     console.log("newTodo",newTodo);

    const updatedTodos = [newTodo, ...todos];
    setTodos(updatedTodos);
    setText('');
    await saveTodos(updatedTodos);
  };

  const updateTodo = async () => {
    const updated = todos.map(todo =>
      todo.id === editId ? { ...todo, text } : todo
    );
    console.log("updateTodo updated", updated)
    setTodos(updated);
    await saveTodos(updated);
    setEditId(null);
    setText('');
  };

  const toggleComplete = async (id) => {
    let newList = [];
    for (let todo of todos) {
      if (todo.id === id) {
        newList.push({ ...todo, completed: !todo.completed });
      } else {
        newList.push(todo);
      }
    }
    console.log("toggleComplete newList",newList);
    setTodos(newList);
    await saveTodos(newList);
  };
  

  const deleteTodo = async (id) => {
    const updated = todos.filter(todo => todo.id !== id);
    console.log("updated list after delete", updated);
    
    setTodos(updated);
    await saveTodos(updated);
  };

  const renderItem = ({ item }) => (
    <View style={{
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height:50
    }}>
      <Text
        style={{
          flex: 1,
          fontSize: 16
        }}
      >
        {item.text}
      </Text>

      <TouchableOpacity onPress={() => toggleComplete(item.id)}>
        <Text style={{ marginHorizontal: 5, color: 'green' }}>{item.completed?"Complete":"Uncomplete"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        setEditId(item.id);
        setText(item.text);
      }}>
        <Text style={{ marginHorizontal: 5, color: 'blue' }}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <Text style={{ marginHorizontal: 5, color: 'red' }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 10, textAlign: 'center' }}>
        Mini Todo App
      </Text>

      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TextInput
          style={{
            borderWidth: 1,
            paddingHorizontal: 8,
            height: 40,
            flex: 1
          }}
          placeholder="Enter task"
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity
          onPress={editId ? updateTodo : addTodo}
          style={{
            backgroundColor: '#ddd',
            paddingHorizontal: 10,
            justifyContent: 'center',
            marginLeft: 8,
            borderRadius: 4
          }}
        >
          <Text>{editId ? 'Update' : 'Add'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default TodoScreen;
