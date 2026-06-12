import React from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store/useAppStore';
import { exhibits } from '@/data/exhibits';
import { badges } from '@/data/badges';
import { routes } from '@/data/routes';
import { getLevelName } from '@/utils';

const MinePage: React.FC = () => {
  const { userProfile, userProgress, collectedExhibits: collectedExhibitIds, savedRoutes, isRouteSaved } = useAppStore();

  const collectedExhibits = exhibits.filter((e) => collectedExhibitIds.includes(e.id));
  const savedRouteList = routes.filter((r) => savedRoutes.includes(r.id));
  const levelName = getLevelName(userProfile.level);

  const handleMenuClick = (url: string, needLogin = false) => {
    console.log('[Mine] click menu:', url);
    if (url) {
      Taro.navigateTo({ url });
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  };

  const menus = [
    {
      icon: '⭐',
      name: '我的收藏',
      desc: `${collectedExhibits.length}件展品`,
      url: '',
    },
    {
      icon: '🗺️',
      name: '已保存路线',
      desc: `${savedRouteList.length}条路线`,
      url: '/pages/my-routes/index',
    },
    {
      icon: '📜',
      name: '参观记录',
      desc: `已参观${userProgress.visitedExhibits.length}件展品`,
      url: '',
    },
    {
      icon: '🎫',
      name: '我的预约',
      desc: '查看预约的活动和讲解员',
      url: '',
    },
    {
      icon: '🪪',
      name: '分享参观卡片',
      desc: '生成精美卡片分享给好友',
      url: '/pages/share-card/index',
    },
    {
      icon: '📝',
      name: '观展反馈',
      desc: '您的建议对我们很重要',
      url: '/pages/feedback/index',
    },
    {
      icon: '⚙️',
      name: '设置',
      desc: '闭馆提醒、无障碍、语言设置',
      url: '/pages/settings/index',
    },
  ];

  return (
    <ScrollView className={styles.container} scrollY enhanced showScrollbar={false}>
      <View className={styles.header}>
        <View className={styles.profile}>
          <Image
            className={styles.avatar}
            src={userProfile.avatar}
            mode="aspectFill"
            onError={(e) => console.error('[Mine] avatar error:', e)}
          />
          <View className={styles.profileInfo}>
            <View className={styles.nameRow}>
              <Text className={styles.nickname}>{userProfile.nickname}</Text>
              <View className={styles.levelBadge}>
                <Text className={styles.levelText}>Lv.{userProfile.level}</Text>
              </View>
            </View>
            <Text className={styles.idText}>{levelName} · ID: 10086</Text>
            <View className={styles.pointsRow}>
              <View className={styles.pointItem}>
                <Text className={styles.pointIcon}>✨</Text>
                <Text className={styles.pointNum}>{userProfile.points}</Text>
                <Text className={styles.pointLabel}>积分</Text>
              </View>
              <View className={styles.pointItem}>
                <Text className={styles.pointIcon}>⏱️</Text>
                <Text className={styles.pointNum}>{userProgress.totalVisitTime}</Text>
                <Text className={styles.pointLabel}>分钟</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{userProgress.visitedExhibits.length}</Text>
            <Text className={styles.statLabel}>已参观</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{collectedExhibits.length}</Text>
            <Text className={styles.statLabel}>收藏</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{savedRouteList.length}</Text>
            <Text className={styles.statLabel}>已保存路线</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{userProgress.collectedBadges.length}</Text>
            <Text className={styles.statLabel}>纪念章</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.favSection}>
          <View className={styles.favHeader}>
            <Text className={styles.favTitle}>最近收藏</Text>
            <Text
              className={styles.favMore}
              onClick={() => Taro.showToast({ title: '查看全部收藏', icon: 'none' })}
            >
              查看全部 →
            </Text>
          </View>
          {collectedExhibits.length > 0 ? (
            <ScrollView scrollX enhanced showScrollbar={false}>
              <View className={styles.favList}>
                {collectedExhibits.slice(0, 5).map((exhibit) => (
                  <View
                    key={exhibit.id}
                    className={styles.favItem}
                    onClick={() =>
                      Taro.navigateTo({
                        url: `/pages/exhibit-detail/index?id=${exhibit.id}`,
                      })
                    }
                  >
                    <Image
                      className={styles.favImage}
                      src={exhibit.image}
                      mode="aspectFill"
                      onError={(e) => console.error('[Mine] fav image error:', e)}
                    />
                    <Text className={styles.favName}>{exhibit.name}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View className={styles.emptyFav}>
              <Text className={styles.emptyFavText}>暂无收藏展品，快去参观吧~</Text>
            </View>
          )}
        </View>
      </View>

      {savedRouteList.length > 0 && (
        <View className={styles.section}>
          <View className={styles.favSection}>
            <View className={styles.favHeader}>
              <Text className={styles.favTitle}>已保存路线</Text>
              <Text
                className={styles.favMore}
                onClick={() => Taro.switchTab({ url: '/pages/guide/index' })}
              >
                查看全部 →
              </Text>
            </View>
            <View className={styles.savedRouteList}>
              {savedRouteList.map((route) => (
                <View
                  key={route.id}
                  className={styles.savedRouteItem}
                  onClick={() => Taro.navigateTo({ url: `/pages/route-detail/index?id=${route.id}` })}
                >
                  <Image
                    className={styles.savedRouteImage}
                    src={route.image}
                    mode="aspectFill"
                    onError={(e) => console.error('[Mine] route image error:', e)}
                  />
                  <View className={styles.savedRouteInfo}>
                    <Text className={styles.savedRouteName}>{route.name}</Text>
                    <Text className={styles.savedRouteMeta}>
                      {route.mode === 'children' ? '👶 儿童模式' : '📚 深度模式'} · {route.exhibitCount}件展品
                    </Text>
                  </View>
                  <Text className={styles.menuArrow}>›</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>常用功能</Text>
        <View className={styles.menuList}>
          {menus.map((menu, index) => (
            <View
              key={index}
              className={styles.menuItem}
              onClick={() => handleMenuClick(menu.url)}
            >
              <Text className={styles.menuIcon}>{menu.icon}</Text>
              <View className={styles.menuContent}>
                <Text className={styles.menuName}>{menu.name}</Text>
                <Text className={styles.menuDesc}>{menu.desc}</Text>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>更多服务</Text>
        <View className={styles.menuList}>
          <View
            className={styles.menuItem}
            onClick={() =>
              Taro.showModal({
                title: '联系我们',
                content: '客服热线：400-888-8888\n邮箱：service@museum.com',
                showCancel: false,
              })
            }
          >
            <Text className={styles.menuIcon}>📞</Text>
            <View className={styles.menuContent}>
              <Text className={styles.menuName}>联系客服</Text>
              <Text className={styles.menuDesc}>工作时间 9:00-17:00</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View
            className={styles.menuItem}
            onClick={() =>
              Taro.showModal({
                title: '关于我们',
                content: '数字文化馆 v1.0.0\n让文化触手可及',
                showCancel: false,
              })
            }
          >
            <Text className={styles.menuIcon}>ℹ️</Text>
            <View className={styles.menuContent}>
              <Text className={styles.menuName}>关于我们</Text>
              <Text className={styles.menuDesc}>数字文化馆 v1.0.0</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default MinePage;
