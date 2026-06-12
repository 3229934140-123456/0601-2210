import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { Quiz } from '@/types';
import classnames from 'classnames';

interface QuizCardProps {
  quiz: Quiz;
  showAnswer?: boolean;
  onComplete?: (correct: boolean) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, showAnswer = false, onComplete }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(showAnswer);
  const isCorrect = selectedIndex === quiz.correctIndex;

  const handleSelect = (index: number) => {
    if (answered) return;
    console.log('[QuizCard] select option:', index);
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null) {
      Taro.showToast({ title: '请选择答案', icon: 'none' });
      return;
    }
    setAnswered(true);
    Taro.showToast({
      title: isCorrect ? '回答正确 +20积分' : '回答错误',
      icon: 'none',
    });
    onComplete && onComplete(isCorrect);
  };

  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <View className={styles.tag}>
          <Text className={styles.tagText}>互动问答</Text>
        </View>
        <Text className={styles.points}>+20积分</Text>
      </View>

      <Text className={styles.question}>{quiz.question}</Text>

      <View className={styles.options}>
        {quiz.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrectOption = index === quiz.correctIndex;
          let optionClass = '';
          if (answered) {
            if (isCorrectOption) {
              optionClass = styles.optionCorrect;
            } else if (isSelected && !isCorrect) {
              optionClass = styles.optionWrong;
            }
          } else if (isSelected) {
            optionClass = styles.optionSelected;
          }

          return (
            <View
              key={index}
              className={classnames(styles.option, optionClass)}
              onClick={() => handleSelect(index)}
            >
              <View className={classnames(styles.optionIndex, optionClass && styles.indexActive)}>
                <Text className={classnames(styles.optionIndexText, optionClass && styles.indexTextActive)}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text className={classnames(styles.optionText, isSelected && !answered && styles.optionTextSelected)}>
                {option}
              </Text>
              {answered && isCorrectOption && (
                <Text className={styles.optionIcon}>✓</Text>
              )}
              {answered && isSelected && !isCorrect && (
                <Text className={styles.optionIconWrong}>✗</Text>
              )}
            </View>
          );
        })}
      </View>

      {answered && (
        <View className={styles.explanation}>
          <Text className={styles.explanationTitle}>解析：</Text>
          <Text className={styles.explanationText}>{quiz.explanation}</Text>
        </View>
      )}

      {!answered && (
        <View
          className={classnames(styles.submitBtn, selectedIndex === null && styles.submitBtnDisabled)}
          onClick={handleSubmit}
        >
          <Text className={styles.submitText}>提交答案</Text>
        </View>
      )}
    </View>
  );
};

export default QuizCard;
