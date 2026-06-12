import React from 'react';
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
  const currentHall = halls.find((h) => h.id === currentHallId);
  const currentExhibits = exhibits.filter((e) => e.hallId === currentHallId);

  const floors = Array.from(new Set(halls.map((h) => h.floor))).sort();
  const activeFloor = currentFloor ?? (currentHall?.floor || floors[0]);

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
          {halls
            .filter((h) => h.floor === activeFloor)
            .map((hall) => (
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
        {currentHall && (
          <>
            <View className={styles.mapHeader}>
              <Text className={styles.mapTitle}>{currentHall.name}</Text>
              <Text className={styles.mapDesc}>{currentHall.description}</Text>
            </View>
            <View className={styles.mapImageWrap}>
              <Image
                className={styles.mapImage}
                src={currentHall.mapImage}
                mode="aspectFill"
                onError={(e) => console.error('[HallMap] map image error:', e)}
              />
              {currentExhibits.map((exhibit) => (
                <View
                  key={exhibit.id}
                  className={classnames(
                    styles.exhibitMarker,
                    visitedExhibits.includes(exhibit.id) && styles.visitedMarker
                  )}
                  style={{
                    left: `${(exhibit.position.x / 600) * 100}%`,
                    top: `${(exhibit.position.y / 400) * 100}%`,
                  }}
                  onClick={() => {
                    console.log('[HallMap] select exhibit:', exhibit.id);
                    onExhibitSelect && onExhibitSelect(exhibit.id);
                  }}
                >
                  <View className={styles.markerDot}></View>
                  <View className={styles.markerLabel}>
                    <Text className={styles.markerText}>{exhibit.name}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View className={styles.mapLegend}>
              <View className={styles.legendItem}>
                <View className={classnames(styles.legendDot, styles.current)}></View>
                <Text className={styles.legendText}>当前位置</Text>
              </View>
              <View className={styles.legendItem}>
                <View className={classnames(styles.legendDot, styles.visited)}></View>
                <Text className={styles.legendText}>已参观</Text>
              </View>
              <View className={styles.legendItem}>
                <View className={styles.legendDot}></View>
                <Text className={styles.legendText}>待参观</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default HallMap;
