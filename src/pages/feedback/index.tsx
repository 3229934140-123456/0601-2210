import { useState } from 'react';
import { View, Text, Input, Textarea, Image } from '@tarojs/components';
import { navigateBack, showToast, chooseImage } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

const ratingLabels = ['非常不满意', '不满意', '一般', '满意', '非常满意'];

const tagOptions = [
  '展品丰富',
  '讲解清晰',
  '环境优雅',
  '互动有趣',
  '路线合理',
  '设施完善',
  '服务周到',
  '语音导览好',
  '标识清楚',
  '建议改进',
];

const FeedbackPage = () => {
  const { addPoints } = useAppStore();

  const [ratings, setRatings] = useState({
    exhibit: 4,
    service: 5,
    environment: 4,
    overall: 5,
  });

  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [contactType, setContactType] = useState('phone');
  const [contact, setContact] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRating = (key: keyof typeof ratings, value: number) => {
    setRatings({ ...ratings, [key]: value });
  };

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleUploadImage = () => {
    if (images.length >= 6) {
      showToast({ title: '最多上传6张图片', icon: 'none' });
      return;
    }
    chooseImage({
      count: 6 - images.length,
      success: (res) => {
        setImages([...images, ...res.tempFilePaths].slice(0, 6));
      },
      fail: () => {
        const mockImgs = [
          'https://picsum.photos/id/3/200/200',
          'https://picsum.photos/id/103/200/200',
        ];
        setImages([...images, ...mockImgs].slice(0, 6));
      },
    });
  };

  const handleSubmit = () => {
    const avgRating = (ratings.exhibit + ratings.service + ratings.environment + ratings.overall) / 4;
    if (avgRating < 3) {
      showToast({ title: '感谢您的宝贵建议', icon: 'none' });
    }
    if (!content.trim() && activeTags.length === 0) {
      showToast({ title: '请选择标签或填写反馈', icon: 'none' });
      return;
    }
    addPoints(15);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigateBack();
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.feedbackHint}>
          <Text>💡 您的反馈对我们非常重要！提交成功将获得 15 积分奖励。您的个人信息仅用于回复反馈，我们将严格保密。</Text>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <Text>满意度评分</Text>
          </View>
          <View className={styles.ratingGroup}>
            {Object.entries({
              exhibit: '展品展示',
              service: '服务质量',
              environment: '场馆环境',
              overall: '总体评价',
            }).map(([key, label]) => (
              <View key={key} className={styles.ratingItem}>
                <View className={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Text
                      key={n}
                      className={`${styles.star} ${n <= ratings[key as keyof typeof ratings] ? styles.active : ''}`}
                      onClick={() => handleRating(key as keyof typeof ratings, n)}
                    >
                      ★
                    </Text>
                  ))}
                </View>
                <Text className={styles.ratingLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <Text>印象标签（可多选）</Text>
          </View>
          <View className={styles.tagOptions}>
            {tagOptions.map((tag) => (
              <View
                key={tag}
                className={`${styles.tagOption} ${activeTags.includes(tag) ? styles.active : ''}`}
                onClick={() => toggleTag(tag)}
              >
                <Text>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <Text>反馈内容</Text>
          </View>
          <View className={styles.formItem}>
            <View className={styles.formLabel}>
              <Text className={styles.required}>*</Text>
              <Text>请详细描述您的观展体验或建议</Text>
            </View>
            <View className={styles.formTextarea}>
              <Textarea
                value={content}
                onInput={(e) => setContent(e.detail.value)}
                placeholder="请输入您的反馈内容，您的建议将帮助我们做得更好..."
                maxlength={500}
                style={{ width: '100%', height: '180rpx', fontSize: 28, lineHeight: 1.6 }}
              />
              <Text className={styles.charCount}>{content.length}/500</Text>
            </View>
          </View>

          <View className={styles.formItem}>
            <View className={styles.formLabel}><Text>上传照片（选填，最多6张）</Text></View>
            <View className={styles.uploadArea}>
              {images.map((img, idx) => (
                <View key={idx} className={styles.uploadItem}>
                  <Image className="image" src={img} mode="aspectFill" />
                </View>
              ))}
              {images.length < 6 && (
                <View className={styles.uploadItem} onClick={handleUploadImage}>
                  <Text>+</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <Text>联系方式（选填）</Text>
          </View>
          <View className={styles.formItem}>
            <View className={styles.formLabel}><Text>回复方式</Text></View>
            <View className={styles.contactGroup}>
              {[
                { key: 'phone', label: '📞 电话' },
                { key: 'email', label: '✉️ 邮箱' },
                { key: 'wechat', label: '💬 微信' },
              ].map((opt) => (
                <View
                  key={opt.key}
                  className={`${styles.contactOption} ${contactType === opt.key ? styles.active : ''}`}
                  onClick={() => setContactType(opt.key)}
                >
                  <Text>{opt.label}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className={styles.formItem}>
            <View className={styles.formLabel}>
              <Text>
                {contactType === 'phone' ? '电话号码' : contactType === 'email' ? '邮箱地址' : '微信号码'}
              </Text>
            </View>
            <Input
              className={styles.formInput}
              value={contact}
              onInput={(e) => setContact(e.detail.value)}
              placeholder={
                contactType === 'phone' ? '请输入电话号码' :
                contactType === 'email' ? '请输入邮箱地址' : '请输入微信号码'
              }
            />
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.secondaryBtn} onClick={() => navigateBack()}>
          <Text>取消</Text>
        </View>
        <View className={styles.primaryBtn} onClick={handleSubmit}>
          <Text>📨</Text>
          <Text>提交反馈</Text>
        </View>
      </View>

      {showSuccess && (
        <View className={styles.successMask} onClick={handleCloseSuccess}>
          <View className={styles.successCard} onClick={(e) => e.stopPropagation()}>
            <View className={styles.successIcon}>🎉</View>
            <Text className={styles.successTitle}>提交成功！</Text>
            <Text className={styles.successDesc}>
              感谢您的宝贵反馈！您的意见将帮助我们为您提供更优质的文化服务。
            </Text>
            <View className={styles.rewardHint}>
              <Text>🎁 获得 15 积分奖励</Text>
            </View>
            <View className={styles.successAction} style={{ marginTop: 32 }} onClick={handleCloseSuccess}>
              <Text>我知道了</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default FeedbackPage;
