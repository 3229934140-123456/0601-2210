import { useMemo, useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { useRouter, navigateBack, showToast, switchTab } from '@tarojs/taro';
import { quizzes, getQuizById, getQuizByExhibitId } from '@/data/quizzes';
import { exhibits } from '@/data/exhibits';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

const QuizPage = () => {
  const router = useRouter();
  const quizId = router.params.id || '';
  const exhibitId = router.params.exhibitId || '';
  const { userProgress, completeQuiz, addPoints } = useAppStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const quizList = useMemo(() => {
    if (quizId) {
      const q = getQuizById(quizId);
      return q ? [q] : quizzes;
    }
    if (exhibitId) {
      const q = getQuizByExhibitId(exhibitId);
      return q ? [q] : quizzes;
    }
    return quizzes;
  }, [quizId, exhibitId]);

  const currentQuiz = quizList[currentIndex];
  const exhibit = useMemo(
    () => exhibits.find((e) => e.id === currentQuiz?.exhibitId),
    [currentQuiz]
  );

  const completedCount = quizList.filter((q) =>
    userProgress.completedQuizzes.includes(q.id)
  ).length;

  const isAlreadyCompleted = useMemo(
    () => userProgress.completedQuizzes.includes(currentQuiz?.id || ''),
    [currentQuiz, userProgress.completedQuizzes]
  );

  useEffect(() => {
    setSelectedOption(null);
    setSubmitted(false);
    setIsCorrect(false);
  }, [currentIndex]);

  useEffect(() => {
    if (isAlreadyCompleted) {
      setSubmitted(true);
      setIsCorrect(true);
    }
  }, [isAlreadyCompleted, currentQuiz]);

  if (!currentQuiz) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyState}>
          <Text className={styles.icon}>📝</Text>
          <Text className={styles.title}>暂无相关题目</Text>
          <Text className={styles.desc}>该展品暂时没有互动问答，去其他展品看看吧！</Text>
        </View>
      </View>
    );
  }

  const handleSelectOption = (idx: number) => {
    if (submitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) {
      showToast({ title: '请选择一个答案', icon: 'none' });
      return;
    }
    const correct = selectedOption === currentQuiz.correctIndex;
    setSubmitted(true);
    setIsCorrect(correct);

    if (correct && !isAlreadyCompleted) {
      completeQuiz(currentQuiz.id);
      addPoints(20);
      showToast({ title: '回答正确！+20积分', icon: 'none' });
    } else if (!correct) {
      showToast({ title: '回答错误，看看解析吧', icon: 'none' });
    }
  };

  const handleNext = () => {
    if (currentIndex < quizList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      showToast({ title: '已完成所有题目', icon: 'success' });
      setTimeout(() => switchTab({ url: '/pages/interact/index' }), 800);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getStatusClass = (idx: number) => {
    if (!submitted) return selectedOption === idx ? 'selected' : '';
    if (idx === currentQuiz.correctIndex) return 'correct';
    if (selectedOption === idx && idx !== currentQuiz.correctIndex) return 'wrong';
    return '';
  };

  const getQuizItemStatus = (qid: string) => {
    if (userProgress.completedQuizzes.includes(qid)) return 'completed';
    const idx = quizList.findIndex((q) => q.id === qid);
    return idx === currentIndex ? 'current' : 'pending';
  };

  return (
    <View className={styles.page}>
      <View className={styles.quizHeader}>
        <View className={styles.quizLabel}>
          <Text>🎯 第 {currentIndex + 1}/{quizList.length} 题</Text>
        </View>
        <Text className={styles.quizTitle}>{currentQuiz.question}</Text>
        <View className={styles.headerStats}>
          {exhibit && (
            <View className={styles.headerStat}>
              <Text>🏛 {exhibit.name}</Text>
            </View>
          )}
          <View className={styles.headerStat}>
            <Text>✅ 已完成 {completedCount}/{quizList.length}</Text>
          </View>
          <View className={styles.headerStat}>
            <Text>🎁 +20积分</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.statusCard}>
          <View className={styles.progressRow}>
            <Text className={styles.progressLabel}>答题进度</Text>
            <Text className={styles.progressValue}>
              {Math.round(((currentIndex + 1) / quizList.length) * 100)}%
            </Text>
          </View>
          <View className={styles.progressBar}>
            <View
              className={styles.progressFill}
              style={{ width: `${((currentIndex + 1) / quizList.length) * 100}%` }}
            />
          </View>
        </View>

        <View className={styles.optionsWrap}>
          {currentQuiz.options.map((opt, idx) => (
            <View
              key={idx}
              className={`${styles.optionCard} ${styles[getStatusClass(idx)]} ${submitted ? styles.disabled : ''}`}
              onClick={() => handleSelectOption(idx)}
            >
              <View className={styles.optionIndex}>
                <Text>{String.fromCharCode(65 + idx)}</Text>
              </View>
              <Text className={styles.optionText}>{opt}</Text>
              {submitted && idx === currentQuiz.correctIndex && (
                <Text className={styles.resultIcon}>✅</Text>
              )}
              {submitted &&
                selectedOption === idx &&
                idx !== currentQuiz.correctIndex && (
                  <Text className={styles.resultIcon}>❌</Text>
                )}
            </View>
          ))}
        </View>

        {submitted && (
          <>
            <View className={styles.explanationCard}>
              <View className={styles.expHeader}>
                <Text className={styles.expIcon}>{isCorrect ? '🎉' : '💡'}</Text>
                <Text className={styles.expTitle}>
                  {isCorrect ? '回答正确！答案解析' : '回答错误，正确答案解析'}
                </Text>
              </View>
              <Text className={styles.expText}>{currentQuiz.explanation}</Text>
            </View>

            {isCorrect && !isAlreadyCompleted && (
              <View className={styles.rewardCard}>
                <Text className={styles.rewardIcon}>🏅</Text>
                <View className={styles.rewardInfo}>
                  <Text className={styles.title}>答题奖励</Text>
                  <Text className={styles.desc}>正确回答获得积分和纪念章进度</Text>
                </View>
                <Text className={styles.rewardPoints}>+20</Text>
              </View>
            )}
          </>
        )}

        {quizList.length > 1 && (
          <View className={styles.allQuizCard}>
            <Text className={styles.allQuizTitle}>全部题目</Text>
            {quizList.map((q, idx) => {
              const status = getQuizItemStatus(q.id);
              return (
                <View
                  key={q.id}
                  className={styles.quizItem}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <View className={`${styles.quizNum} ${styles[status]}`}>
                    <Text>{idx + 1}</Text>
                  </View>
                  <Text className={styles.quizQ}>{q.question}</Text>
                  <View className={`${styles.quizStatus} ${styles[status]}`}>
                    <Text>
                      {status === 'completed' ? '已完成' : status === 'current' ? '当前' : '待答题'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View className={styles.bottomBar}>
        <View
          className={styles.secondaryBtn}
          onClick={handlePrev}
          style={{ opacity: currentIndex === 0 ? 0.5 : 1, pointerEvents: currentIndex === 0 ? 'none' : 'auto' }}
        >
          <Text>←</Text>
          <Text>上一题</Text>
        </View>
        {!submitted ? (
          <View
            className={`${styles.primaryBtn} ${selectedOption === null ? styles.disabled : ''}`}
            onClick={handleSubmit}
          >
            <Text>📝</Text>
            <Text>提交答案</Text>
          </View>
        ) : (
          <View className={styles.primaryBtn} onClick={handleNext}>
            <Text>→</Text>
            <Text>{currentIndex < quizList.length - 1 ? '下一题' : '完成答题'}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default QuizPage;
