import { useMemo, useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { badges, getBadgeById } from '@/data/badges';
import { useAppStore } from '@/store/useAppStore';
import { Badge } from '@/types';
import styles from './index.module.scss';

const filters = [
  { key: 'all', label: '全部' },
  { key: 'obtained', label: '已获得' },
  { key: 'gold', label: '金奖章' },
  { key: 'silver', label: '银奖章' },
  { key: 'bronze', label: '铜奖章' },
  { key: 'special', label: '特殊章' },
];

const BadgeWallPage = () => {
  const { userProgress } = useAppStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const obtainedCount = userProgress.collectedBadges.length;
  const totalCount = badges.length;

  const filteredBadges = useMemo(() => {
    let list = badges.map((b) => ({
      ...b,
      obtained: userProgress.collectedBadges.includes(b.id),
    }));

    switch (activeFilter) {
      case 'obtained':
        list = list.filter((b) => b.obtained);
        break;
      case 'gold':
      case 'silver':
      case 'bronze':
      case 'special':
        list = list.filter((b) => b.type === activeFilter);
        break;
      default:
        break;
    }
    return list;
  }, [activeFilter, userProgress.collectedBadges]);

  const goldCount = badges.filter(
    (b) => b.type === 'gold' && userProgress.collectedBadges.includes(b.id)
  ).length;
  const silverCount = badges.filter(
    (b) => b.type === 'silver' && userProgress.collectedBadges.includes(b.id)
  ).length;
  const bronzeCount = badges.filter(
    (b) => b.type === 'bronze' && userProgress.collectedBadges.includes(b.id)
  ).length;
  const specialCount = badges.filter(
    (b) => b.type === 'special' && userProgress.collectedBadges.includes(b.id)
  ).length;

  return (
    <View className={styles.page}>
      <View className={styles.headerSection}>
        <Text className={styles.headerTitle}>🏅 我的纪念章墙</Text>
        <View className={styles.statsRow}>
          <View className={styles.statBlock}>
            <Text className={styles.num}>{obtainedCount}/{totalCount}</Text>
            <Text className={styles.label}>收集进度</Text>
          </View>
          <View className={styles.statBlock}>
            <Text className={styles.num}>{Math.round((obtainedCount / totalCount) * 100)}%</Text>
            <Text className={styles.label}>完成度</Text>
          </View>
        </View>
      </View>

      <View className={styles.filterTabs}>
        {filters.map((f) => (
          <View
            key={f.key}
            className={`${styles.tabItem} ${activeFilter === f.key ? styles.active : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            <Text>{f.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.contentWrap}>
        <View className={styles.legendCard}>
          <View className={styles.legendItem}>
            <View className={styles.dot} style={{ background: 'linear-gradient(135deg,#FFE8A0,#C9A859)' }} />
            <Text>金奖章 {goldCount}</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={styles.dot} style={{ background: 'linear-gradient(135deg,#F0F0F0,#C0C0C0)' }} />
            <Text>银奖章 {silverCount}</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={styles.dot} style={{ background: 'linear-gradient(135deg,#F5C89C,#CD7F32)' }} />
            <Text>铜奖章 {bronzeCount}</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={styles.dot} style={{ background: 'linear-gradient(135deg,#D4A574,#8B4513)' }} />
            <Text>特殊章 {specialCount}</Text>
          </View>
        </View>

        {filteredBadges.length > 0 ? (
          <View className={styles.badgeGrid}>
            {filteredBadges.map((badge) => (
              <View
                key={badge.id}
                className={`${styles.badgeCard} ${badge.obtained ? styles.obtained : styles.locked} ${styles[badge.type]}`}
                onClick={() => setSelectedBadge(badge)}
              >
                <View className={`${styles.badgeImageWrap} ${styles[badge.type]}`}>
                  {!badge.obtained && (
                    <View className={styles.lockIcon}>
                      <Text>🔒</Text>
                    </View>
                  )}
                  <Image
                    className="image"
                    src={badge.image}
                    mode="aspectFill"
                    onError={(e) => console.log('[BadgeWall] image error:', e)}
                  />
                </View>
                <Text className={styles.badgeName}>{badge.name}</Text>
                <View className={`${styles.rarityTag} ${styles[badge.rarity]}`}>
                  <Text>{badge.rarity}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.icon}>📭</Text>
            <Text className={styles.title}>暂无此类纪念章</Text>
            <Text className={styles.desc}>多多参与参观和互动活动，解锁更多精美的纪念章吧！</Text>
          </View>
        )}
      </View>

      {selectedBadge && (
        <View className={styles.detailMask} onClick={() => setSelectedBadge(null)}>
          <View className={styles.detailCard} onClick={(e) => e.stopPropagation()}>
            <View className={`${styles.detailBanner} ${styles[selectedBadge.type]}`}>
              <View className={styles.detailBadgeImg}>
                <Image
                  className="image"
                  src={selectedBadge.image}
                  mode="aspectFill"
                  onError={(e) => console.log('[BadgeDetail] image error:', e)}
                />
              </View>
              {!selectedBadge.obtained && (
                <View className={styles.lockOverlay}>
                  <Text>🔒</Text>
                </View>
              )}
            </View>
            <View className={styles.detailContent}>
              <Text className={styles.detailName}>{selectedBadge.name}</Text>
              <View className={styles.detailRarity}>
                <View className={`${styles.rarityTag} ${styles[selectedBadge.rarity]}`} style={{ display: 'inline-block', padding: '6rpx 24rpx', borderRadius: 20, fontSize: 24, color: '#fff' }}>
                  <Text>✨ {selectedBadge.rarity}</Text>
                </View>
              </View>
              <View className={styles.detailRow}>
                <View className={styles.label}><Text>纪念章描述</Text></View>
                <View className={styles.value}><Text>{selectedBadge.description}</Text></View>
              </View>
              <View className={styles.detailRow}>
                <View className={styles.label}><Text>获得条件</Text></View>
                <View className={styles.value}>
                  <Text style={{ color: selectedBadge.obtained ? '#2E7D5B' : '#8B4513', fontWeight: 500 }}>
                    {selectedBadge.condition}
                  </Text>
                </View>
              </View>
              <View className={styles.detailRow}>
                <View className={styles.label}><Text>获得状态</Text></View>
                <View className={styles.value}>
                  {selectedBadge.obtained ? (
                    <Text style={{ color: '#2E7D5B' }}>✅ 已获得 · {selectedBadge.obtainedDate || '最近'}</Text>
                  ) : (
                    <Text style={{ color: '#999' }}>⏳ 未获得</Text>
                  )}
                </View>
              </View>
            </View>
            <View className={styles.closeBtn} onClick={() => setSelectedBadge(null)}>
              <Text>{selectedBadge.obtained ? '我知道了' : '继续努力'}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default BadgeWallPage;
