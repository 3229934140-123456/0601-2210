import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

export interface GridItem {
  icon: string;
  name: string;
  url?: string;
  onClick?: () => void;
  badge?: string;
}

interface FunctionGridProps {
  items: GridItem[];
  columns?: number;
}

const FunctionGrid: React.FC<FunctionGridProps> = ({ items, columns = 4 }) => {
  const handleClick = (item: GridItem) => {
    console.log('[FunctionGrid] click:', item.name);
    if (item.onClick) {
      item.onClick();
    } else if (item.url) {
      Taro.navigateTo({ url: item.url });
    }
  };

  return (
    <View
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {items.map((item, index) => (
        <View
          key={index}
          className={styles.gridItem}
          onClick={() => handleClick(item)}
        >
          <View className={styles.iconWrap}>
            <Text className={styles.icon}>{item.icon}</Text>
            {item.badge && (
              <View className={styles.badge}>
                <Text className={styles.badgeText}>{item.badge}</Text>
              </View>
            )}
          </View>
          <Text className={styles.name}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default FunctionGrid;
