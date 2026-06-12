import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { routes } from '@/data/routes';
import { formatDuration } from '@/utils';
import classnames from 'classnames';
import styles from './index.module.scss';

type ModeFilter = 'all' | 'children' | 'deep';

const modeTabs: Array<{ key: ModeFilter; label: string; icon: string }> = [
  { key: 'all', label: '全部', icon: '📋' },
  { key: 'children', label: '儿童模式', icon: '👶' },
  { key: 'deep', label: '深度模式', icon: '📚' },
];

const MyRoutesPage: React.FC = () => {
  const { savedRoutes, toggleSaveRoute, isRouteSaved, userProgress } = useAppStore();
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all');
  const [, forceRefresh] = useState(0);

  useDidShow(() => {
    forceRefresh((n) => n + 1);
  });

  const savedRouteList = useMemo(() => {
    let list = routes.filter((r) => isRouteSaved(r.id));
    if (modeFilter !== 'all') {
      list = list.filter((r) => r.mode === modeFilter);
    }
    return list;
  }, [savedRoutes, modeFilter, isRouteSaved]);

  const totalSaved = routes.filter((r) => isRouteSaved(r.id)).length;
  const visitedExhibitIds = userProgress.visitedExhibits;

  const getRouteProgress = (route: typeof routes[0]) => {
    const nodes = Array.isArray(route.nodes) ? route.nodes : [];
    const completed = nodes.filter((n) => n && n.exhibitId && visitedExhibitIds.includes(n.exhibitId)).length;
    const total = nodes.length || 1;
    return {
      completed,
      total,
      percent: Math.min(100, Math.round((completed / total) * 100)),
    };
  };

  const handleViewDetail = (routeId: string) => {
    Taro.navigateTo({ url: `/pages/route-detail/index?id=${routeId}` });
  };

  const handleContinueVisit = (routeId: string) => {
    Taro.navigateTo({ url: `/pages/route-detail/index?id=${routeId}` });
  };

  const handleToggleSave = (routeId: string, e: any, routeName: string) => {
    e.stopPropagation?.();
    Taro.showModal({
      title: '提示',
      content: `确定要取消保存「${routeName}」吗？`,
      confirmText: '取消保存',
      cancelText: '保留',
      success: (res) => {
        if (res.confirm) {
          toggleSaveRoute(routeId);
          Taro.showToast({ title: '已取消保存', icon: 'none' });
          forceRefresh((n) => n + 1);
        }
      },
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.summary}>
          <Text className={styles.summaryNum}>{totalSaved}</Text>
          <Text className={styles.summaryLabel}>条已保存路线</Text>
        </View>
        <View className={styles.filterTabs}>
          {modeTabs.map((tab) => (
            <View
              key={tab.key}
              className={classnames(
                styles.filterTab,
                modeFilter === tab.key && styles.filterTabActive
              )}
              onClick={() => setModeFilter(tab.key)}
            >
              <Text className={styles.filterIcon}>{tab.icon}</Text>
              <Text className={styles.filterText}>{tab.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView className={styles.content} scrollY enhanced showScrollbar={false}>
        {savedRouteList.length > 0 ? (
          <View className={styles.routeList}>
            {savedRouteList.map((route) => {
              const prog = getRouteProgress(route);
              return (
                <View
                  key={route.id}
                  className={styles.routeCard}
                  onClick={() => handleViewDetail(route.id)}
                >
                  <View className={styles.routeCover}>
                    <Image
                      className={styles.routeImage}
                      src={route.image}
                      mode="aspectFill"
                      onError={(e) => console.error('[MyRoutes] route image error:', e)}
                    />
                    <View className={styles.modeBadge}>
                      <Text>
                        {route.mode === 'children' ? '👶 儿童模式' : '📚 深度模式'}
                      </Text>
                    </View>
                    <View
                      className={styles.saveBtn}
                      onClick={(e) => handleToggleSave(route.id, e, route.name)}
                    >
                      <Text className={styles.saveText}>❤️</Text>
                    </View>
                  </View>

                  <View className={styles.routeInfo}>
                    <View className={styles.routeHeader}>
                      <Text className={styles.routeName}>{route.name}</Text>
                      <View className={styles.diffBadge}>
                        <Text>{route.difficulty}</Text>
                      </View>
                    </View>
                    <View className={styles.routeMeta}>
                      <Text>⏱ {formatDuration(route.duration)}</Text>
                      <Text>📦 {route.exhibitCount} 件展品</Text>
                    </View>

                    <View className={styles.progressRow}>
                      <View className={styles.progressWrap}>
                        <View className={styles.progressBar}>
                          <View
                            className={styles.progressFill}
                            style={{ width: `${prog.percent}%` }}
                          />
                        </View>
                        <Text className={styles.progressText}>
                          {prog.completed}/{prog.total} 已参观
                        </Text>
                      </View>
                      <Text className={styles.percent}>{prog.percent}%</Text>
                    </View>

                    <View className={styles.actionRow}>
                      <View
                        className={classnames(
                          styles.actionBtn,
                          prog.percent === 100
                            ? styles.secondaryBtn
                            : styles.primaryBtn
                        )}
                        onClick={(e) => {
                          e.stopPropagation?.();
                          handleContinueVisit(route.id);
                        }}
                      >
                        <Text>
                          {prog.percent === 0
                            ? '开始导览'
                            : prog.percent === 100
                              ? '再次参观'
                              : `继续参观（第${prog.completed + 1}站）`}
                        </Text>
                      </View>
                      <View
                        className={styles.detailBtn}
                        onClick={(e) => {
                          e.stopPropagation?.();
                          handleViewDetail(route.id);
                        }}
                      >
                        <Text>查看详情 ›</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🗺️</Text>
            <Text className={styles.emptyTitle}>还没有保存的路线</Text>
            <Text className={styles.emptyDesc}>
              {modeFilter === 'all'
                ? '去导览页挑选喜欢的路线保存吧'
                : modeFilter === 'children'
                  ? '没有保存儿童模式路线'
                  : '没有保存深度模式路线'}
            </Text>
            <View className={styles.emptyBtn} onClick={() => Taro.switchTab({ url: '/pages/guide/index' })}>
              <Text>去导览页看看</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MyRoutesPage;
