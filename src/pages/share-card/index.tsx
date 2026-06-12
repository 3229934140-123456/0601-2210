import { useMemo, useState } from 'react';
import { View, Text, Image, Textarea } from '@tarojs/components';
import Taro, { showToast, showModal, getEnv, ENV_TYPE } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { getLevelName } from '@/utils';
import dayjs from 'dayjs';
import styles from './index.module.scss';

const themes = [
  { key: 'classic', name: '典雅棕' },
  { key: 'elegant', name: '沉静蓝' },
  { key: 'fresh', name: '生机绿' },
  { key: 'gold', name: '古金黄' },
];

const quoteOptions = [
  { main: '与文明对话，与历史同行', sub: '穿越千年时光，感受中华文化的博大精深' },
  { main: '一次观展，一生回忆', sub: '在文物中触摸历史的温度' },
  { main: '探索未知，发现美好', sub: '每件文物背后都有动人的故事' },
  { main: '文化传承，你我同行', sub: '让千年文明在心中生根发芽' },
];

const ShareCardPage = () => {
  const { userProfile, userProgress } = useAppStore();

  const [theme, setTheme] = useState('classic');
  const [customQuote, setCustomQuote] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);

  const currentQuote = useMemo(() => {
    if (customQuote.trim()) {
      return { main: customQuote, sub: '' };
    }
    return quoteOptions[quoteIndex];
  }, [customQuote, quoteIndex]);

  const visitData = {
    exhibits: userProgress.visitedExhibits.length,
    badges: userProgress.collectedBadges.length,
    time: userProgress.totalVisitTime,
  };

  const todayStr = dayjs().format('YYYY年MM月DD日');

  const handleSaveImage = () => {
    const env = getEnv();
    if (env === ENV_TYPE.WEAPP || env === ENV_TYPE.ALIPAY) {
      showToast({ title: '保存图片功能开发中', icon: 'none' });
    } else {
      showModal({
        title: '提示',
        content: 'H5 暂不支持直接保存图片，请长按卡片区域截图保存',
        showCancel: false,
      });
    }
  };

  const handleShare = () => {
    const env = getEnv();
    if (env === ENV_TYPE.WEAPP) {
      showToast({ title: '请点击右上角「···」分享', icon: 'none' });
    } else if (env === ENV_TYPE.WEB) {
      if (navigator.share) {
        navigator.share({
          title: '数字文化馆 - 我的观展记录',
          text: `我在数字文化馆参观了 ${visitData.exhibits} 件展品，收集了 ${visitData.badges} 枚纪念章，一起来体验吧！`,
          url: window.location.href,
        }).catch(() => {});
      } else {
        showModal({
          title: '分享',
          content: '请点击浏览器菜单选择分享，或复制链接分享给好友',
          confirmText: '复制链接',
          success: (res) => {
            if (res.confirm) {
              const url = window.location.href;
              navigator.clipboard?.writeText(url).then(() => {
                showToast({ title: '链接已复制', icon: 'success' });
              }).catch(() => {
                showToast({ title: '复制失败，请手动复制', icon: 'none' });
              });
            }
          },
        });
      }
    } else {
      showToast({ title: '请点击右上角分享', icon: 'none' });
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.cardThemeTabs}>
          {themes.map((t) => (
            <View
              key={t.key}
              className={`${styles.themeTab} ${theme === t.key ? styles.active : ''}`}
              onClick={() => setTheme(t.key)}
            >
              <Text>{t.name}</Text>
            </View>
          ))}
        </View>

        <View className={`${styles.shareCard} ${styles[theme]}`}>
          <View className={styles.cardWatermark} />

          <View className={styles.cardHeader}>
            <View className={styles.cardLogo}>
              <Text>🏛</Text>
            </View>
            <View className={styles.cardTitleGroup}>
              <Text className={styles.cardMuseumName}>数字文化馆</Text>
              <Text className={styles.cardDate}>{todayStr}</Text>
            </View>
          </View>

          <View className={styles.cardMain}>
            <Text className={styles.cardQuote}>"{currentQuote.main}"</Text>
            {currentQuote.sub && (
              <Text className={styles.cardSubQuote}>{currentQuote.sub}</Text>
            )}

            <View className={styles.statGroup}>
              <View className={styles.statItem}>
                <Text className={styles.statNum}>{visitData.exhibits}</Text>
                <Text className={styles.statLabel}>参观展品</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statNum}>{visitData.badges}</Text>
                <Text className={styles.statLabel}>纪念章</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statNum}>{visitData.time}</Text>
                <Text className={styles.statLabel}>参观分钟</Text>
              </View>
            </View>
          </View>

          <View className={styles.cardFooter}>
            <View className={styles.visitorInfo}>
              <View className={styles.visitorAvatar}>
                <Image
                  className="image"
                  src={userProfile.avatar}
                  mode="aspectFill"
                  onError={(e) => console.log('[ShareCard] avatar error:', e)}
                />
              </View>
              <View className={styles.visitorText}>
                <Text className={styles.name}>{userProfile.nickname}</Text>
                <Text className={styles.level}>Lv.{userProfile.level} {getLevelName(userProfile.level)}</Text>
              </View>
              <Text className={styles.visitorBadge}>🏅</Text>
            </View>
          </View>
        </View>

        <View className={styles.cardSection}>
          <View className={styles.sectionTitle}>
            <Text>卡片风格</Text>
          </View>
          <View className={styles.stylesRow}>
            {themes.map((t) => (
              <View
                key={t.key}
                className={`${styles.styleItem} ${styles[t.key]} ${theme === t.key ? styles.active : ''}`}
                onClick={() => setTheme(t.key)}
              />
            ))}
          </View>
        </View>

        <View className={styles.cardSection}>
          <View className={styles.sectionTitle}>
            <Text>选择文案</Text>
          </View>
          {quoteOptions.map((q, idx) => (
            <View
              key={idx}
              className={`${styles.styleItem} ${quoteIndex === idx ? styles.active : ''}`}
              style={{
                width: 'auto',
                height: 'auto',
                padding: '20rpx 24rpx',
                borderRadius: 16,
                marginBottom: 16,
                background: quoteIndex === idx ? 'rgba(139,69,19,0.06)' : 'rgba(0,0,0,0.04)',
                border: quoteIndex === idx ? '2rpx solid #8B4513' : '2rpx solid transparent',
              }}
              onClick={() => {
                setQuoteIndex(idx);
                setCustomQuote('');
              }}
            >
              <Text style={{ fontSize: 26, fontWeight: quoteIndex === idx ? 600 : 400, color: quoteIndex === idx ? '#8B4513' : '#333', lineHeight: 1.6 }}>
                {q.main}
              </Text>
            </View>
          ))}
        </View>

        <View className={styles.cardSection}>
          <View className={styles.sectionTitle}>
            <Text>自定义文案</Text>
          </View>
          <View className={styles.customTextarea}>
            <Textarea
              value={customQuote}
              onInput={(e) => setCustomQuote(e.detail.value)}
              placeholder="输入您想展示的个性化文案（≤30字）"
              maxlength={30}
              style={{ width: '100%', height: '80rpx', fontSize: 28 }}
            />
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={`${styles.actionBtn} ${styles.outline}`} onClick={handleSaveImage}>
          <Text>💾</Text>
          <Text>保存图片</Text>
        </View>
        <View className={`${styles.actionBtn} ${styles.primary}`} onClick={handleShare}>
          <Text>↗</Text>
          <Text>分享给好友</Text>
        </View>
      </View>
    </View>
  );
};

export default ShareCardPage;
