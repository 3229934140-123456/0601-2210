import { useMemo, useState } from 'react';
import { View, Text, Image, Input, Textarea } from '@tarojs/components';
import { useRouter, navigateBack, showToast } from '@tarojs/taro';
import { guides, getGuideById } from '@/data/activities';
import { Guide } from '@/types';
import styles from './index.module.scss';

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const timeSlots = ['09:00', '10:30', '13:30', '15:00'];

const GuideBookingPage = () => {
  const router = useRouter();
  const guideId = router.params.id || 'guide1';
  const initialGuide = useMemo(() => getGuideById(guideId) || guides[0], [guideId]);

  const [selectedGuide, setSelectedGuide] = useState<Guide>(initialGuide);
  const [selectedDate, setSelectedDate] = useState<string>(selectedGuide.availableDates[0] || '');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorCount, setVisitorCount] = useState('2');
  const [remark, setRemark] = useState('');

  const pricePerHour = 200;
  const totalPrice = pricePerHour * 2;

  const handleSelectGuide = (g: Guide) => {
    setSelectedGuide(g);
    setSelectedDate(g.availableDates[0] || '');
    setSelectedTime('');
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      showToast({ title: '请选择日期', icon: 'none' });
      return;
    }
    if (!selectedTime) {
      showToast({ title: '请选择时间段', icon: 'none' });
      return;
    }
    if (!visitorName.trim()) {
      showToast({ title: '请填写您的姓名', icon: 'none' });
      return;
    }
    if (!visitorPhone.trim()) {
      showToast({ title: '请填写联系电话', icon: 'none' });
      return;
    }
    showToast({ title: '预约提交成功！', icon: 'success' });
    setTimeout(() => navigateBack(), 1200);
  };

  return (
    <View className={styles.page}>
      <View className={styles.guideDetail}>
        <View className={styles.avatarRow}>
          <View className={styles.avatar}>
            <Image
              className="image"
              src={selectedGuide.avatar}
              mode="aspectFill"
              onError={(e) => console.log('[GuideBooking] avatar error:', e)}
            />
          </View>
          <View className={styles.guideInfo}>
            <Text className={styles.guideName}>{selectedGuide.name}</Text>
            <View className={styles.ratingRow}>
              <Text className={styles.stars}>★★★★★</Text>
              <Text className={styles.ratingNum}>{selectedGuide.rating}分</Text>
            </View>
            <Text className={styles.experience}>从业 {selectedGuide.experience} 年</Text>
          </View>
        </View>

        <View className={styles.tagsRow}>
          <View className={`${styles.tag} ${styles.specialty}`}>
            <Text>🎯 专长：{selectedGuide.specialty}</Text>
          </View>
          {selectedGuide.languages.map((lang) => (
            <View key={lang} className={`${styles.tag} ${styles.language}`}>
              <Text>🗣 {lang}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionTitle}>
          <Text>讲解员简介</Text>
        </View>
        <Text className={styles.bioText}>{selectedGuide.bio}</Text>
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionTitle}>
          <Text>选择日期</Text>
        </View>
        <View className={styles.dateGrid}>
          {weekDays.map((day) => {
            const isAvailable = selectedGuide.availableDates.includes(day);
            return (
              <View
                key={day}
                className={`${styles.dateItem} ${isAvailable ? styles.available : ''} ${
                  selectedDate === day ? styles.selected : ''
                }`}
                onClick={() => isAvailable && setSelectedDate(day)}
              >
                <Text>{day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionTitle}>
          <Text>选择时段（每场约2小时）</Text>
        </View>
        <View className={styles.timeGrid}>
          {timeSlots.map((time) => (
            <View
              key={time}
              className={`${styles.timeItem} ${styles.available} ${
                selectedTime === time ? styles.selected : ''
              }`}
              onClick={() => setSelectedTime(time)}
            >
              <Text>{time}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionTitle}>
          <Text>预约信息</Text>
        </View>
        <View className={styles.formItem}>
          <View className={styles.formLabel}><Text>参观人数</Text></View>
          <Input
            className={styles.formInput}
            type="number"
            value={visitorCount}
            onInput={(e) => setVisitorCount(e.detail.value)}
            placeholder="请输入参观人数"
          />
        </View>
        <View className={styles.formItem}>
          <View className={styles.formLabel}><Text>联系人姓名</Text></View>
          <Input
            className={styles.formInput}
            value={visitorName}
            onInput={(e) => setVisitorName(e.detail.value)}
            placeholder="请输入您的姓名"
          />
        </View>
        <View className={styles.formItem}>
          <View className={styles.formLabel}><Text>联系电话</Text></View>
          <Input
            className={styles.formInput}
            type="phone"
            value={visitorPhone}
            onInput={(e) => setVisitorPhone(e.detail.value)}
            placeholder="请输入联系电话"
          />
        </View>
        <View className={styles.formItem}>
          <View className={styles.formLabel}><Text>备注说明（选填）</Text></View>
          <Textarea
            className={styles.formTextarea}
            value={remark}
            onInput={(e) => setRemark(e.detail.value)}
            placeholder="如有特殊需求请备注说明"
            maxlength={200}
          />
        </View>
      </View>

      <View className={styles.guideListHeader}>
        <Text className={styles.guideListTitle}>其他讲解员</Text>
        <Text className={styles.seeAll}>共 {guides.length} 位</Text>
      </View>

      <View className={styles.guideList}>
        {guides
          .filter((g) => g.id !== selectedGuide.id)
          .map((g) => (
            <View
              key={g.id}
              className={`${styles.guideCard} ${selectedGuide.id === g.id ? styles.active : ''}`}
              onClick={() => handleSelectGuide(g)}
            >
              <View className={styles.smallAvatar}>
                <Image
                  className="image"
                  src={g.avatar}
                  mode="aspectFill"
                  onError={(e) => console.log('[GuideBooking] avatar error:', e)}
                />
              </View>
              <View className={styles.guideCardInfo}>
                <Text className={styles.guideCardName}>{g.name}</Text>
                <View className={styles.guideCardMeta}>
                  <Text>★ {g.rating}</Text>
                  <Text>从业{g.experience}年</Text>
                </View>
                <View className={styles.guideCardTags}>
                  <View className={styles.smallTag}>
                    <Text>{g.specialty}</Text>
                  </View>
                  {g.languages.slice(0, 2).map((l) => (
                    <View key={l} className={styles.smallTag}>
                      <Text>{l}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View className={styles.bookBtn} onClick={() => handleSelectGuide(g)}>
                <Text>选择</Text>
              </View>
            </View>
          ))}
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.totalRow}>
          <Text className={styles.totalLabel}>讲解服务费用</Text>
          <View className={styles.totalPrice}>
            <Text className={styles.unit}>¥</Text>
            <Text>{totalPrice}</Text>
          </View>
        </View>
        <View className={styles.primaryBtn} onClick={handleSubmit}>
          <Text>📅</Text>
          <Text>立即预约</Text>
        </View>
      </View>
    </View>
  );
};

export default GuideBookingPage;
