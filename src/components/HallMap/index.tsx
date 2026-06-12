import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import styles from './index.module.scss';
import { Hall, Exhibit } from '@/types';
import classnames from 'classnames';

interface HallMapProps {
  halls: Hall[];
  currentHallId: string;
  currentFloor?: number;
  exhibits?: Exhibit[];
  onHallSelect?: (hallId: string) => void;
  onExhibitSelect?: (exhibitId: string) => void;
  onFloorChange?: (floor: number) => void;
  visitedExhibits?: string[];
}

const HALL_LAYOUT: Record<number, Array<{ x: number; y: number; w: number; h: number }>> = {
  1: [
    { x: 4, y: 6, w: 42, h: 40 },
    { x: 54, y: 6, w: 42, h: 40 },
    { x: 4, y: 54, w: 42, h: 40 },
    { x: 54, y: 54, w: 42, h: 40 },
  ],
  2: [
    { x: 4, y: 6, w: 28, h: 40 },
    { x: 36, y: 6, w: 28, h: 40 },
    { x: 68, y: 6, w: 28, h: 40 },
    { x: 20, y: 54, w: 28, h: 40 },
    { x: 52, y: 54, w: 28, h: 40 },
  ],
  3: [
    { x: 8, y: 10, w: 36, h: 80 },
    { x: 56, y: 10, w: 36, h: 36 },
    { x: 56, y: 54, w: 36, h: 36 },
  ],
};

const EXHIBIT_SLOTS: Array<Array<number>> = [
  [20, 25],
  [50, 20],
  [75, 30],
  [30, 55],
  [60, 60],
  [80, 70],
  [20, 75],
  [50, 80],
];

const HallMap: React.FC<HallMapProps> = ({
  halls,
  currentHallId,
  currentFloor,
  exhibits = [],
  onHallSelect,
  onExhibitSelect,
  onFloorChange,
  visitedExhibits = [],
}) => {
  const floors = useMemo(() => Array.from(new Set(halls.map((h) => h.floor))).sort(), [halls]);
  const currentHall = halls.find((h) => h.id === currentHallId);
  const activeFloor = currentFloor ?? (currentHall?.floor || floors[0]);

  const hallsOnFloor = useMemo(
    () => halls.filter((h) => h.floor === activeFloor),
    [halls, activeFloor]
  );

  const exhibitsOnFloor = useMemo(
    () => exhibits.filter((e) => hallsOnFloor.some((h) => h.id === e.hallId)),
    [exhibits, hallsOnFloor]
  );

  const hallLayout = HALL_LAYOUT[activeFloor] || HALL_LAYOUT[1];

  const getHallLayout = (hallIndex: number) => {
    return hallLayout[hallIndex] || { x: 10, y: 10, w: 30, h: 30 };
  };

  const getExhibitPositionInHall = (exhibitIndex: number, hallLayoutData: { x: number; y: number; w: number; h: number }) => {
    const slot = EXHIBIT_SLOTS[exhibitIndex % EXHIBIT_SLOTS.length];
    const pxOffset = (slot[0] / 100) * hallLayoutData.w;
    const pyOffset = (slot[1] / 100) * hallLayoutData.h;
    return {
      x: hallLayoutData.x + pxOffset,
      y: hallLayoutData.y + pyOffset,
    };
  };

  const getExhibitsByHall = (hallId: string) => {
    return exhibits.filter((e) => e.hallId === hallId);
  };

  const isFocusMode = !!currentHallId && hallsOnFloor.some((h) => h.id === currentHallId);

  return (
    <View className={styles.container}>
      <View className={styles.floorTabs}>
        {floors.map((floor) => (
          <View
            key={floor}
            className={classnames(
              styles.floorTab,
              activeFloor === floor && styles.floorTabActive
            )}
            onClick={() => {
              onFloorChange && onFloorChange(floor);
            }}
          >
            <Text className={styles.floorTabText}>{floor}F</Text>
          </View>
        ))}
      </View>

      <ScrollView className={styles.hallScroll} scrollX enhanced showScrollbar={false}>
        <View className={styles.hallList}>
          {hallsOnFloor.map((hall, _idx) => (
            <View
              key={hall.id}
              className={classnames(
                styles.hallItem,
                hall.id === currentHallId && styles.hallItemActive
              )}
              onClick={() => {
                console.log('[HallMap] select hall:', hall.id);
                onHallSelect && onHallSelect(hall.id);
              }}
            >
              <Text className={styles.hallName}>{hall.name.split('·')[1] || hall.name}</Text>
              {hall.isAccessible && (
                <View className={styles.accessTag}>
                  <Text className={styles.accessText}>♿</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles.mapArea}>
        <View className={styles.mapHeader}>
          {isFocusMode && currentHall ? (
            <>
              <Text className={styles.mapTitle}>{currentHall.name}</Text>
              <Text className={styles.mapDesc}>{currentHall.description}</Text>
            </>
          ) : (
            <>
              <Text className={styles.mapTitle}>{activeFloor}F 层平面图</Text>
              <Text className={styles.mapDesc}>
                共 {hallsOnFloor.length} 个展厅 · {exhibitsOnFloor.length} 件展品
              </Text>
            </>
          )}
        </View>

        <View className={styles.mapImageWrap}>
          <View
            className={classnames(
              styles.mapFloorPlan,
              styles[`floor${activeFloor}`]
            )}
          >
            {hallsOnFloor.map((hall, hallIndex) => {
              const layout = getHallLayout(hallIndex);
              const isFocused = hall.id === currentHallId;
              const hallExhibits = getExhibitsByHall(hall.id);
              return (
                <View key={hall.id}>
                  <View
                    className={classnames(
                      styles.hallBlock,
                      isFocused && styles.hallBlockActive,
                      !isFocusMode && styles.hallBlockClickable
                    )}
                    style={{
                      left: `${layout.x}%`,
                      top: `${layout.y}%`,
                      width: `${layout.w}%`,
                      height: `${layout.h}%`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isFocusMode || isFocused) {
                        onHallSelect && onHallSelect(hall.id);
                      }
                    }}
                  >
                    <View className={styles.hallBlockHeader}>
                      <Text className={styles.hallBlockName}>
                        {hall.name.split('·')[1] || hall.name}
                      </Text>
                      {hall.isAccessible && (
                        <Text className={styles.hallBlockAccess}>♿</Text>
                      )}
                    </View>
                    <Text className={styles.hallBlockCount}>
                      {hallExhibits.length}件
                    </Text>
                  </View>

                  {hallExhibits.map((exhibit, exhibitIndex) => {
                    const pos = isFocusMode && isFocused
                      ? {
                          x: layout.x + (exhibit.position.x / 600) * layout.w,
                          y: layout.y + (exhibit.position.y / 400) * layout.h,
                        }
                      : getExhibitPositionInHall(exhibitIndex, layout);

                    const visited = visitedExhibits.includes(exhibit.id);
                    return (
                      <View
                        key={exhibit.id}
                        className={classnames(
                          styles.exhibitMarker,
                          visited && styles.visitedMarker,
                          !(isFocusMode && isFocused) && styles.miniMarker
                        )}
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('[HallMap] select exhibit:', exhibit.id);
                          onExhibitSelect && onExhibitSelect(exhibit.id);
                        }}
                      >
                        <View className={styles.markerDot}></View>
                        {(isFocusMode && isFocused) && (
                          <View className={styles.markerLabel}>
                            <Text className={styles.markerText}>{exhibit.name}</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </View>

        <View className={styles.mapToolbar}>
          {isFocusMode && (
            <View
              className={styles.toolbarBtn}
              onClick={() => onHallSelect && onHallSelect('')}
            >
              <Text>📐 返回{activeFloor}F 全览</Text>
            </View>
          )}
        </View>

        <View className={styles.mapLegend}>
          <View className={styles.legendItem}>
            <View className={classnames(styles.legendDot, styles.hallLegend)}></View>
            <Text className={styles.legendText}>展厅</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={styles.legendDot}></View>
            <Text className={styles.legendText}>待参观展品</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={classnames(styles.legendDot, styles.visited)}></View>
            <Text className={styles.legendText}>已参观展品</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HallMap;
