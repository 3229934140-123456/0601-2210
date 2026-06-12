import { useState } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import { showToast, navigateBack, showModal, makePhoneCall } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { getLevelName } from '@/utils';
import styles from './index.module.scss';

const SettingsPage = () => {
  const { userProfile, updateProfile, userProgress } = useAppStore();

  const [closingReminder, setClosingReminder] = useState(userProfile.closingReminder);
  const [accessibilityMode, setAccessibilityMode] = useState(userProfile.accessibilityMode);
  const [language, setLanguage] = useState(userProfile.preferredLanguage);
  const [audioAutoPlay, setAudioAutoPlay] = useState(false);
  const [notification, setNotification] = useState(true);
  const [nickname, setNickname] = useState(userProfile.nickname);
  const [showEdit, setShowEdit] = useState(false);

  const handleToggleClosing = () => {
    const newVal = !closingReminder;
    setClosingReminder(newVal);
    updateProfile({ closingReminder: newVal });
    showToast({ title: newVal ? '已开启闭馆提醒' : '已关闭闭馆提醒', icon: 'none' });
  };

  const handleToggleAccessibility = () => {
    const newVal = !accessibilityMode;
    setAccessibilityMode(newVal);
    updateProfile({ accessibilityMode: newVal });
    showToast({ title: newVal ? '已开启无障碍模式' : '已关闭无障碍模式', icon: 'none' });
  };

  const handleToggleAudio = () => {
    setAudioAutoPlay(!audioAutoPlay);
    showToast({ title: audioAutoPlay ? '已关闭自动播放' : '已开启自动播放', icon: 'none' });
  };

  const handleToggleNotification = () => {
    setNotification(!notification);
  };

  const handleClearCache = () => {
    showModal({
      title: '清除缓存',
      content: '确定要清除本地缓存吗？',
      success: (res) => {
        if (res.confirm) {
          showToast({ title: '缓存已清除', icon: 'success' });
        }
      },
    });
  };

  const handleLogout = () => {
    showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          showToast({ title: '已退出登录', icon: 'none' });
        }
      },
    });
  };

  const handleSaveNickname = () => {
    if (!nickname.trim()) {
      showToast({ title: '昵称不能为空', icon: 'none' });
      return;
    }
    updateProfile({ nickname: nickname.trim() });
    setShowEdit(false);
    showToast({ title: '昵称已更新', icon: 'success' });
  };

  const Switch = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <View className={`${styles.switchWrap} ${on ? styles.on : ''}`} onClick={onChange}>
      <View className={styles.switchDot} />
    </View>
  );

  const LanguageOptions = () => (
    <View className={styles.optionGroup}>
      {[
        { key: 'zh', label: '简体中文' },
        { key: 'en', label: 'English' },
        { key: 'ja', label: '日本語' },
        { key: 'fr', label: 'Français' },
      ].map((opt) => (
        <View
          key={opt.key}
          className={`${styles.optionBtn} ${language === opt.key ? styles.active : ''}`}
          onClick={() => {
            setLanguage(opt.key);
            updateProfile({ preferredLanguage: opt.key });
          }}
        >
          <Text>{opt.label}</Text>
        </View>
      ))}
    </View>
  );

  const fontSizeOptions = () => (
    <View className={styles.optionGroup}>
      {['小', '标准', '大', '特大'].map((opt, idx) => (
        <View
          key={opt}
          className={`${styles.optionBtn} ${idx === 1 ? styles.active : ''}`}
          onClick={() => showToast({ title: `已切换为${opt}字体`, icon: 'none' })}
        >
          <Text>{opt}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View className={styles.page}>
      <View className={styles.userHeader}>
        <View className={styles.userRow}>
          <View className={styles.avatar}>
            <Image
              className="image"
              src={userProfile.avatar}
              mode="aspectFill"
              onError={(e) => console.log('[Settings] avatar error:', e)}
            />
          </View>
          <View className={styles.userInfo}>
            <Text className={styles.nickname}>{userProfile.nickname}</Text>
            <Text className={styles.userLevel}>
              Lv.{userProfile.level} {getLevelName(userProfile.level)} · {userProfile.points} 积分
            </Text>
          </View>
          <View className={styles.editBtn} onClick={() => setShowEdit(!showEdit)}>
            <Text>编辑</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        {showEdit && (
          <View className={styles.sectionGroup} style={{ marginBottom: 24, padding: 24 }}>
            <View className={styles.groupItem} style={{ borderBottom: 'none', padding: 0 }}>
              <View className={styles.itemIcon} style={{ marginRight: 16 }}>
                <Text>✏️</Text>
              </View>
              <View className={styles.itemContent}>
                <Input
                  value={nickname}
                  onInput={(e) => setNickname(e.detail.value)}
                  placeholder="请输入新昵称"
                  style={{ fontSize: 28, padding: '12rpx 0' }}
                />
              </View>
              <View
                style={{
                  padding: '10rpx 24rpx',
                  borderRadius: 24,
                  background: '#8B4513',
                  color: '#fff',
                  fontSize: 24,
                }}
                onClick={handleSaveNickname}
              >
                <Text>保存</Text>
              </View>
            </View>
          </View>
        )}

        <View className={styles.sectionGroup}>
          <View className={styles.groupHeader}><Text>参观设置</Text></View>

          <View className={styles.groupItem}>
            <View className={styles.itemIcon}><Text>⏰</Text></View>
            <View className={styles.itemContent}>
              <Text className={styles.itemName}>闭馆提醒</Text>
              <Text className={styles.itemDesc}>闭馆前30分钟提醒您</Text>
            </View>
            <Switch on={closingReminder} onChange={handleToggleClosing} />
          </View>

          <View className={styles.groupItem}>
            <View className={styles.itemIcon} style={{ background: accessibilityMode ? 'rgba(201,168,89,0.15)' : 'rgba(139,69,19,0.08)' }}>
              <Text>♿</Text>
            </View>
            <View className={styles.itemContent}>
              <Text className={styles.itemName}>无障碍模式</Text>
              <Text className={styles.itemDesc}>优先展示无障碍路线和提示</Text>
            </View>
            <Switch on={accessibilityMode} onChange={handleToggleAccessibility} />
          </View>

          <View className={styles.groupItem}>
            <View className={styles.itemIcon}><Text>🔊</Text></View>
            <View className={styles.itemContent}>
              <Text className={styles.itemName}>语音自动播放</Text>
              <Text className={styles.itemDesc}>进入展品页自动播放讲解</Text>
            </View>
            <Switch on={audioAutoPlay} onChange={handleToggleAudio} />
          </View>

          <View className={styles.groupItem}>
            <View className={styles.itemIcon}><Text>🔔</Text></View>
            <View className={styles.itemContent}>
              <Text className={styles.itemName}>消息通知</Text>
              <Text className={styles.itemDesc}>接收活动提醒和新展通知</Text>
            </View>
            <Switch on={notification} onChange={handleToggleNotification} />
          </View>
        </View>

        <View className={styles.sectionGroup}>
          <View className={styles.groupHeader}><Text>显示与语言</Text></View>

          <View className={styles.groupItem}>
            <View className={styles.itemIcon}><Text>🌐</Text></View>
            <View className={styles.itemContent}>
              <Text className={styles.itemName}>界面语言</Text>
            </View>
          </View>
          <View style={{ padding: '0 28rpx 24rpx' }}>
            <LanguageOptions />
          </View>

          <View className={styles.groupItem}>
            <View className={styles.itemIcon}><Text>A</Text></View>
            <View className={styles.itemContent}>
              <Text className={styles.itemName}>字体大小</Text>
            </View>
          </View>
          <View style={{ padding: '0 28rpx 24rpx' }}>
            {fontSizeOptions()}
          </View>
        </View>

        <View className={styles.sectionGroup}>
          <View className={styles.groupHeader}><Text>数据与隐私</Text></View>

          <View className={styles.groupItem} onClick={handleClearCache}>
            <View className={styles.itemIcon}><Text>🗑</Text></View>
            <View className={styles.itemContent}>
              <Text className={styles.itemName}>清除缓存</Text>
              <Text className={styles.itemDesc}>清除本地图片和数据缓存（约12.6MB）</Text>
            </View>
            <Text className={styles.itemArrow}>›</Text>
          </View>

          <View className={styles.groupItem}>
            <View className={styles.itemIcon}><Text>📊</Text></View>
            <View className={styles.itemContent}>
              <Text className={styles.itemName}>参观数据统计</Text>
              <Text className={styles.itemDesc}>
                {userProgress.visitedExhibits.length}件展品 · {userProgress.collectedBadges.length}枚纪念章 · {userProgress.totalVisitTime}分钟
              </Text>
            </View>
            <Text className={styles.itemArrow}>›</Text>
          </View>

          <View className={styles.groupItem} onClick={() => navigateBack()}>
            <View className={styles.itemIcon}><Text>🔒</Text></View>
            <View className={styles.itemContent}>
              <Text className={styles.itemName}>隐私政策</Text>
              <Text className={styles.itemDesc}>了解我们如何保护您的信息</Text>
            </View>
            <Text className={styles.itemArrow}>›</Text>
          </View>
        </View>

        <View className={styles.sectionGroup}>
          <View className={styles.groupHeader}><Text>联系与帮助</Text></View>

          <View className={styles.groupItem} onClick={() => makePhoneCall({ phoneNumber: '400-888-8888' }).catch(() => {})}>
            <View className={styles.itemIcon}><Text>📞</Text></View>
            <View className={styles.itemContent}>
              <Text className={styles.itemName}>客服热线</Text>
              <Text className={styles.itemDesc}>400-888-8888（09:00-18:00）</Text>
            </View>
            <Text className={styles.itemArrow}>›</Text>
          </View>

          <View className={styles.groupItem}>
            <View className={styles.itemIcon}><Text>❓</Text></View>
            <View className={styles.itemContent}>
              <Text className={styles.itemName}>常见问题</Text>
              <Text className={styles.itemDesc}>预约、取票、参观须知等</Text>
            </View>
            <Text className={styles.itemArrow}>›</Text>
          </View>

          <View className={styles.groupItem}>
            <View className={styles.itemIcon}><Text>💡</Text></View>
            <View className={styles.itemContent}>
              <Text className={styles.itemName}>意见反馈</Text>
              <Text className={styles.itemDesc}>帮助我们做得更好</Text>
            </View>
            <Text className={styles.itemArrow}>›</Text>
          </View>

          <View className={styles.groupItem}>
            <View className={styles.itemIcon}><Text>⭐</Text></View>
            <View className={styles.itemContent}>
              <Text className={styles.itemName}>给我们评分</Text>
              <Text className={styles.itemDesc}>您的鼓励是我们的动力</Text>
            </View>
            <Text className={styles.itemArrow}>›</Text>
          </View>
        </View>

        <View className={styles.bottomActions}>
          <View className={styles.dangerBtn} onClick={handleLogout}>
            <Text>退出登录</Text>
          </View>
        </View>

        <View className={styles.aboutInfo}>
          <Text>数字文化馆 v1.0.0</Text>
          <Text style={{ display: 'block' }}>© 2024 数字文化馆 版权所有</Text>
        </View>
      </View>
    </View>
  );
};

export default SettingsPage;
