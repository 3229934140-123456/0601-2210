import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import SearchBar from '@/components/SearchBar';
import SectionHeader from '@/components/SectionHeader';
import HallMap from '@/components/HallMap';
import ExhibitCard from '@/components/ExhibitCard';
import { exhibits, searchExhibits } from '@/data/exhibits';
import { halls } from '@/data/halls';
import { useAppStore } from '@/store/useAppStore';
import classnames from 'classnames';

const GuidePage: React.FC = () => {
  const { currentHallId, setCurrentHall, userProgress, userProfile } = useAppStore();
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'views' | 'era'>('default');

  const categories = useMemo(() => {
    const set = new Set(exhibits.map((e) => e.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredExhibits = useMemo(() => {
    let result = searchExhibits(keyword);
    if (currentHallId) {
      result = result.filter((e) => e.hallId === currentHallId);
    }
    if (categoryFilter !== 'all') {
      result = result.filter((e) => e.category === categoryFilter);
    }
    if (sortBy === 'views') {
      result = [...result].sort((a, b) => b.views - a.views);
    } else if (sortBy === 'era') {
      result = [...result].sort((a, b) => a.era.localeCompare(b.era));
    }
    return result;
  }, [keyword, currentHallId, categoryFilter, sortBy]);

  const handleHallSelect = (hallId: string) => {
    console.log('[GuidePage] select hall:', hallId);
    setCurrentHall(hallId);
  };

  const handleExhibitSelect = (exhibitId: string) => {
    console.log('[GuidePage] select exhibit:', exhibitId);
    Taro.navigateTo({ url: `/pages/exhibit-detail/index?id=${exhibitId}` });
  };

  const currentHall = halls.find((h) => h.id === currentHallId);
  const showAccessTip = userProfile.accessibilityMode && currentHall && !currentHall.isAccessible;

  const toggleSort = () => {
    setSortBy((prev) => {
      if (prev === 'default') return 'views';
      if (prev === 'views') return 'era';
      return 'default';
    });
    Taro.showToast({
      title: sortBy === 'default' ? '按热度排序' : sortBy === 'views' ? '按年代排序' : '默认排序',
      icon: 'none',
    });
  };

  return (
    <ScrollView className={styles.container} scrollY enhanced showScrollbar={false}>
      <View className={styles.searchWrap}>
        <SearchBar
          placeholder="搜索展品名称、类别..."
          value={keyword}
          onChange={setKeyword}
          onSearch={setKeyword}
        />
      </View>

      <View className={styles.section}>
        <SectionHeader
          title="展厅地图"
          subtitle={currentHall ? `当前：${currentHall.name.split('·')[1]}` : '请选择展厅'}
          showMore={false}
        />
        {showAccessTip && (
          <View className={styles.accessTip}>
            <Text className={styles.accessIcon}>♿</Text>
            <Text className={styles.accessText}>
              当前展厅无障碍设施不完善，建议选择标有无障碍标志的展厅参观。
            </Text>
          </View>
        )}
        <HallMap
          halls={halls}
          currentHallId={currentHallId}
          exhibits={exhibits}
          visitedExhibits={userProgress.visitedExhibits}
          onHallSelect={handleHallSelect}
          onExhibitSelect={handleExhibitSelect}
        />
      </View>

      <View className={styles.section}>
        <SectionHeader
          title="分类筛选"
          showMore={false}
        />
        <View className={styles.filterTabs}>
          {categories.map((cat) => (
            <View
              key={cat}
              className={classnames(
                styles.filterTab,
                categoryFilter === cat && styles.filterTabActive
              )}
              onClick={() => {
                console.log('[GuidePage] filter category:', cat);
                setCategoryFilter(cat);
              }}
            >
              <Text className={styles.filterTabText}>
                {cat === 'all' ? '全部' : cat}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.listHeader}>
          <Text className={styles.listTitle}>展品列表</Text>
          <View className={styles.listHeader}>
            <Text className={styles.listCount}>
              共 {filteredExhibits.length} 件
            </Text>
            <View className={styles.sortBtn} onClick={toggleSort}>
              <Text className={styles.sortText}>
                {sortBy === 'default' ? '排序' : sortBy === 'views' ? '热度' : '年代'} ↕
              </Text>
            </View>
          </View>
        </View>

        {filteredExhibits.length > 0 ? (
          <View className={styles.exhibitList}>
            {filteredExhibits.map((exhibit) => (
              <ExhibitCard
                key={exhibit.id}
                exhibit={exhibit}
                compact={false}
                visited={userProgress.visitedExhibits.includes(exhibit.id)}
              />
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🔍</Text>
            <Text className={styles.emptyText}>暂无符合条件的展品</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default GuidePage;
