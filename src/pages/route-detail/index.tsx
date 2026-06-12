import { useMemo, useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { useRouter, useDidShow, navigateTo, showToast, switchTab } from '@tarojs/taro';
import { getRouteById } from '@/data/routes';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration } from '@/utils';
import styles from './index.module.scss';

const RouteDetailPage = () => {
  const router = useRouter();
  const routeId = router.params.id || 'route1';
  const route = useMemo(() => getRouteById(routeId), [routeId]);
  const { visitedExhibits, isRouteSaved, toggleSaveRoute } = useAppStore();
  const saved = route ? isRouteSaved(routeId) : false;
  const [, forceRefresh] = useState(0);

  useDidShow(() => {
    forceRefresh((n) => n + 1);
  });

  if (!route) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 32, textAlign: 'center', color: '#999' }}>
          <Text>路线不存在</Text>
        </View>
      </View>
    );
  }

  const safeNodes = Array.isArray(route.nodes) ? route.nodes : [];
  const safeVisited = Array.isArray(visitedExhibits) ? visitedExhibits : [];

  const completedCount = safeNodes.filter((n) => n && n.exhibitId && safeVisited.includes(n.exhibitId)).length;
  const totalCount = Math.max(safeNodes.length, 1);
  const progress = Math.min(100, Math.round((completedCount / totalCount) * 100));
  const currentIndex = safeNodes.findIndex((n) => n && n.exhibitId && !safeVisited.includes(n.exhibitId));

  const getNodeStatus = (index: number): string => {
    const node = safeNodes[index];
    if (!node) return 'pending';
    if (node.exhibitId && safeVisited.includes(node.exhibitId)) return 'completed';
    if (index === currentIndex) return 'current';
    return 'pending';
  };

  const getStatusText = (status: string) => {
    if (status === 'completed') return '已完成';
    if (status === 'current') return '进行中';
    return '未开始';
  };

  const handleSaveRoute = () => {
    toggleSaveRoute(routeId);
    showToast({ title: !saved ? '已保存路线' : '已取消保存', icon: 'none' });
  };

  const handleExhibitClick = (exhibitId: string) => {
    navigateTo({ url: `/pages/exhibit-detail/index?id=${exhibitId}` });
  };

  const handleStartGuide = () => {
    const targetIndex = currentIndex >= 0 ? currentIndex : 0;
    const currentNode = safeNodes[targetIndex];
    if (currentNode && currentNode.exhibitId) {
      navigateTo({ url: `/pages/exhibit-detail/index?id=${currentNode.exhibitId}` });
    }
  };

  const handleViewMap = () => {
    switchTab({ url: '/pages/guide/index' });
  };

  const handleShare = () => {
    showToast({ title: '分享功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.headerBanner}>
        <Image
          className="image"
          src={route.image}
          mode="aspectFill"
          onError={(e) => console.log('[RouteDetail] banner error:', e)}
        />
        <View className={styles.bannerOverlay} />
        <View className={styles.bannerContent}>
          <Text className={styles.routeName}>{route.name}</Text>
          <View>
            <View className={styles.modeTag}>
              <Text>{route.mode === 'children' ? '👶 儿童模式' : '🔍 深度模式'}</Text>
            </View>
            <View className={styles.modeTag}>
              <Text>{route.difficulty}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.statsCard}>
          <View className={styles.statItem}>
            <Text className={styles.num}>{formatDuration(route.duration)}</Text>
            <Text className={styles.label}>预计时长</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.num}>{safeNodes.length}</Text>
            <Text className={styles.label}>展品数量</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.num}>{completedCount}/{safeNodes.length}</Text>
            <Text className={styles.label}>已完成</Text>
          </View>
        </View>

        <View className={styles.descCard}>
          <View className={styles.sectionTitle}>
            <Text>路线介绍</Text>
          </View>
          <Text className={styles.descText}>{route.description}</Text>
        </View>

        <View className={styles.progressSection}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressTitle}>参观进度</Text>
            <Text className={styles.progressText}>{progress}%</Text>
          </View>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${progress}%` }} />
          </View>

          <View className={styles.timeline}>
            <View className={styles.timelineLine} />
            {safeNodes.map((node, index) => {
              const status = getNodeStatus(index);
              return (
                <View
                  key={node?.exhibitId || `node-${index}`}
                  className={`${styles.timelineNode} ${styles[status]}`}
                >
                  <View className={styles.nodeHeader}>
                    <Text className={styles.nodeName}>
                      {index + 1}. {node?.exhibitName || '未知节点'}
                    </Text>
                    <View className={`${styles.nodeStatus} ${styles[status]}`}>
                      <Text>{getStatusText(status)}</Text>
                    </View>
                  </View>
                  <View className={styles.nodeMeta}>
                    <Text>⏱ 约 {formatDuration(node?.estimatedTime || 5)}</Text>
                    <Text>📍 第{Math.ceil((index + 1) / 3)}展厅</Text>
                  </View>
                  <View className={styles.nodeAction}>
                    <View
                      className={`${styles.actionBtn} ${status === 'pending' ? styles.secondary : styles.primary}`}
                      onClick={() => node?.exhibitId && handleExhibitClick(node.exhibitId)}
                    >
                      <Text>{status === 'completed' ? '再次参观' : status === 'current' ? '立即前往' : '查看详情'}</Text>
                    </View>
                    {status !== 'completed' && (
                      <View className={`${styles.actionBtn} ${styles.secondary}`} onClick={handleViewMap}>
                        <Text>地图定位</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.outlineBtn} onClick={handleSaveRoute}>
          <Text>{saved ? '❤️' : '🤍'}</Text>
          <Text>{saved ? '已保存' : '保存路线'}</Text>
        </View>
        <View className={styles.outlineBtn} onClick={handleShare}>
          <Text>↗</Text>
          <Text>分享</Text>
        </View>
        <View className={styles.primaryBtn} onClick={handleStartGuide}>
          <Text>🎧</Text>
          <Text>{completedCount > 0 ? '继续参观' : '开始导览'}</Text>
        </View>
      </View>
    </View>
  );
};

export default RouteDetailPage;
