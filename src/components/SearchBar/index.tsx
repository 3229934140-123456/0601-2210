import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onSearch?: (keyword: string) => void;
  onChange?: (value: string) => void;
  showScan?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '搜索展品、展厅...',
  value,
  onSearch,
  onChange,
  showScan = true,
}) => {
  const [inputValue, setInputValue] = useState(value || '');

  const handleInput = (e) => {
    const v = e.detail.value;
    setInputValue(v);
    onChange && onChange(v);
  };

  const handleConfirm = () => {
    console.log('[SearchBar] search:', inputValue);
    onSearch && onSearch(inputValue);
  };

  const handleScan = () => {
    console.log('[SearchBar] scan qr code');
    Taro.scanCode({
      success: (res) => {
        console.log('[SearchBar] scan result:', res);
        if (res.result) {
          Taro.showToast({ title: '识别成功', icon: 'success' });
          const params = res.result.includes('exhibit=') ? res.result.split('exhibit=')[1] : '';
          if (params) {
            Taro.navigateTo({ url: `/pages/exhibit-detail/index?id=${params}` });
          }
        }
      },
      fail: (err) => {
        console.error('[SearchBar] scan error:', err);
        Taro.showToast({ title: '扫码取消', icon: 'none' });
      },
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.searchWrap}>
        <Text className={styles.searchIcon}>🔍</Text>
        <Input
          className={styles.input}
          type="text"
          placeholder={placeholder}
          placeholderClass={styles.placeholder}
          value={inputValue}
          onInput={handleInput}
          onConfirm={handleConfirm}
          confirmType="search"
        />
        {inputValue && (
          <Text
            className={styles.clearIcon}
            onClick={() => {
              setInputValue('');
              onChange && onChange('');
            }}
          >
            ×
          </Text>
        )}
      </View>
      {showScan && (
        <View className={styles.scanBtn} onClick={handleScan}>
          <Text className={styles.scanIcon}>📷</Text>
          <Text className={styles.scanText}>扫码</Text>
        </View>
      )}
    </View>
  );
};

export default SearchBar;
