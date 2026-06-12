import React, { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import SearchBar from '@/components/SearchBar';
import SectionHeader from '@/components/SectionHeader';
import FunctionGrid from '@/components/FunctionGrid';
import ExhibitCard from '@/components/ExhibitCard';
import { exhibits, searchExhibits } from '@/data/exhibits';
import { routes } from '@/data/routes';
import { useAppStore } from '@/store/useAppStore';
import classnames from 'classnames';
import { GridItem } from '@/components/FunctionGrid';

const HomePage: React.FC = () => {
  const [routeMode, setRouteMode] = useState<'children' | 'deep'>('children');
  const [searchKeyword, setSearchKeyword] = useState('');
  const { userProfile, userProgress } = useAppStore();

  useDidShow(() => {
    console.log('[HomePage] page show');
    if (userProfile.closingReminder) {
      console.log('[HomePage] closing reminder enabled');
    }
  });

  const functionItems: GridItem[] = [
    { icon: '🗺️', name: '展厅地图', url: '/pages/guide/index' },
    { icon: '🧭', name: '路线推荐', onClick: () => Taro.switchTab({ url: '/pages/guide/index' }) },
    { icon: '📖', name: '语音导览', onClick: () => Taro.showToast({ title: '请进入展品详情开启语音', icon: 'none' }) },
    { icon: '📷', name: '扫码识物', onClick: () => Taro.scanCode({
      success: (res) => {
        console.log('[Home] scan result:', res);
        Taro.showToast({ title: '扫码成功', icon: 'success' });
      },
      fail: () => Taro.showToast({ title: '已取消', icon: 'none' }),
    }) },
    { icon: '❓', name: '互动问答', url: '/pages/quiz/index' },
    { icon: '🏅', name: '纪念章墙', url: '/pages/badge-wall/index' },
    { icon: '👩‍🏫', name: '预约讲解', url: '/pages/guide-booking/index' },
    { icon: '📅', name: '活动排期', onClick: () => Taro.switchTab({ url: '/pages/activity/index' }) },
  ];

  const handleSearch = useCallback((keyword: string) => {
    console.log('[HomePage] search:', keyword);
    setSearchKeyword(keyword);
    if (keyword) {
      Taro.switchTab({ url: '/pages/guide/index' });
    }
  }, []);

  const filteredRoutes = routes.filter((r) => r.mode === routeMode);
  const hotExhibits = exhibits.slice(0, 5);
  const recommendedExhibits = searchKeyword ? searchExhibits(searchKeyword).slice(0, 4) : exhibits.slice(2, 6);
  const progressPercent = Math.min(
    Math.round((userProgress.visitedExhibits.length / exhibits.length) * 100),
    100
  );

  const handleLocation = () => {
    console.log('[HomePage] locate current hall');
    Taro.showLoading({ title: '定位中...' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '当前位置：第一展厅', icon: 'none' });
      Taro.switchTab({ url: '/pages/guide/index' });
    }, 1000);
  };

  return (
    <ScrollView className={styles.container} scrollY enhanced showScrollbar={false}>
      <View className={styles.header}>
        <View className={styles.greetingRow}>
          <View className={styles.greeting}>
            <Text className={styles.greetingTitle}>欢迎来到数字文化馆</Text>
            <Text className={styles.greetingSub}>
              {userProfile.nickname} · Lv.{userProfile.level} {userProfile.points}积分
            </Text>
          </View>
          <View className={styles.locationBtn} onClick={handleLocation}>
            <Text className={styles.locationIcon}>📍</Text>
            <Text className={styles.locationText}>定位</Text>
          </View>
        </View>

        <SearchBar
          placeholder="搜索展品、展厅、文物..."
          onChange={setSearchKeyword}
          onSearch={handleSearch}
        />
      </View>

      <View className={styles.banner}>
        <View className={styles.bannerTop}>
          <View className={styles.bannerTag}>
            <Text className={styles.bannerTagText}>🎯 今日推荐</Text>
          </View>
          <Text className={styles.bannerTitle}>千年文明 · 数字呈现</Text>
          <Text className={styles.bannerDesc}>沉浸式体验中华五千年文化瑰宝</Text>
        </View>
        <View className={styles.bannerBottom}>
          <View className={styles.bannerStats}>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{exhibits.length}</Text>
              <Text className={styles.statLabel}>展品总数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{userProgress.visitedExhibits.length}</Text>
              <Text className={styles.statLabel}>已参观</Text>
            </View>
          </View>
          <View
            className={styles.bannerBtn}
            onClick={() => Taro.switchTab({ url: '/pages/guide/index' })}
          >
            <Text className={styles.bannerBtnText}>开始参观 →</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <FunctionGrid items={functionItems} columns={4} />
      </View>

      <View className={styles.section}>
        <SectionHeader
          title="智能路线"
          subtitle={`${progressPercent}% 完成度`}
          showMore={true}
          onMoreClick={() => Taro.switchTab({ url: '/pages/guide/index' })}
        />
        <View className={styles.routeTabs}>
          <View
            className={classnames(
              styles.routeTab,
              routeMode === 'children' && styles.routeTabActive
            )}
            onClick={() => setRouteMode('children')}
          >
            <Text className={styles.routeTabText}>👶 儿童模式</Text>
          </View>
          <View
            className={classnames(
              styles.routeTab,
              routeMode === 'deep' && styles.routeTabActive
            )}
            onClick={() => setRouteMode('deep')}
          >
            <Text className={styles.routeTabText}>📚 深度模式</Text>
          </View>
        </View>

        {filteredRoutes.slice(0, 2).map((route) => {
          const completedNodes = route.nodes.filter((n) => n.isCompleted).length;
          const routeProgress = Math.round((completedNodes / route.nodes.length) * 100);
          return (
            <View
              key={route.id}
              className={styles.routeCard}
              onClick={() =>
                Taro.navigateTo({ url: `/pages/route-detail/index?id=${route.id}` })
              }
            >
              <View className={styles.routeCardTop}>
                <Image
                  className={styles.routeImage}
                  src={route.image}
                  mode="aspectFill"
                  onError={(e) => console.error('[Home] route image error:', e)}
                />
                <View className={styles.routeInfo}>
                  <Text className={styles.routeName}>{route.name}</Text>
                  <Text className={styles.routeDesc}>{route.description}</Text>
                  <View className={styles.routeMeta}>
                    <View className={styles.metaItem}>
                      <Text className={styles.metaIcon}>⏱️</Text>
                      <Text className={styles.metaText}>
                        {Math.floor(route.duration / 60)}h{route.duration % 60}m
                      </Text>
                    </View>
                    <View className={styles.metaItem}>
                      <Text className={styles.metaIcon}>🎯</Text>
                      <Text className={styles.metaText}>{route.exhibitCount}件展品</Text>
                    </View>
                    <View className={styles.difficultyTag}>
                      <Text className={styles.difficultyText}>{route.difficulty}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View className={styles.routeCardBottom}>
                <View className={styles.progressInfo}>
                  <View className={styles.progressTop}>
                    <Text className={styles.progressLabel}>参观进度</Text>
                    <Text className={styles.progressPercent}>{routeProgress}%</Text>
                  </View>
                  <View className={styles.progressBar}>
                    <View
                      className={styles.progressFill}
                      style={{ width: `${routeProgress}%` }}
                    ></View>
                  </View>
                </View>
                <View
                  className={styles.startBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    Taro.navigateTo({ url: `/pages/route-detail/index?id=${route.id}` });
                  }}
                >
                  <Text className={styles.startBtnText}>
                    {completedNodes > 0 ? '继续' : '开始'}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View className={styles.section}>
        <SectionHeader
          title="热门展品"
          subtitle="本周人气"
          showMore={true}
          onMoreClick={() => Taro.switchTab({ url: '/pages/guide/index' })}
        />
        <ScrollView
          className={styles.exhibitScroll}
          scrollX
          enhanced
          showScrollbar={false}
        >
          <View className={styles.exhibitList}>
            {hotExhibits.map((exhibit) => (
              <View
                key={exhibit.id}
                className={styles.exhibitItem}
                onClick={() =>
                  Taro.navigateTo({ url: `/pages/exhibit-detail/index?id=${exhibit.id}` })
                }
              >
                <Image
                  className={styles.exhibitItemImage}
                  src={exhibit.image}
                  mode="aspectFill"
                  onError={(e) => console.error('[Home] exhibit image error:', e)}
                />
                <View className={styles.exhibitItemBody}>
                  <Text className={styles.exhibitItemName}>{exhibit.name}</Text>
                  <Text className={styles.exhibitItemEra}>{exhibit.era}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.section}>
        <SectionHeader title="为您推荐" showMore={false} />
        {recommendedExhibits.map((exhibit) => (
          <ExhibitCard
            key={exhibit.id}
            exhibit={exhibit}
            compact={true}
            visited={userProgress.visitedExhibits.includes(exhibit.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default HomePage;
