import React, { useEffect, useState, useCallback } from 'react';
import { useClient, useFormValue, set } from 'sanity';
import { Card, Stack, Text, Badge, Flex, Box, Button } from '@sanity/ui';

export function OrderInput(props) {
  const { onChange, value, renderDefault } = props;
  const client = useClient({ apiVersion: '2024-01-01' });
  
  const docId = useFormValue(['_id']);
  const docType = useFormValue(['_type']) || 'tool';

  const [loading, setLoading] = useState(true);
  const [existingItems, setExistingItems] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const cleanId = (docId || '').replace(/^drafts\./, '');
      
      const query = `*[_type == $docType && !(_id in [$cleanId, "drafts." + $cleanId]) && defined(order)]{
        _id,
        title,
        order
      } | order(order asc)`;

      const results = await client.fetch(query, { docType, cleanId });
      setExistingItems(results || []);
    } catch (err) {
      console.error('Error fetching order numbers in Sanity Studio:', err);
    } finally {
      setLoading(false);
    }
  }, [client, docId, docType]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Calculations
  const usedNumbers = existingItems.map((item) => item.order).filter((n) => typeof n === 'number');
  const maxOrder = usedNumbers.length > 0 ? Math.max(...usedNumbers) : -1;
  const nextRecommended = maxOrder + 1;

  const currentOrderNum = typeof value === 'number' ? value : undefined;
  const conflictItem = currentOrderNum !== undefined 
    ? existingItems.find((item) => item.order === currentOrderNum)
    : null;

  const isCurrentUsed = Boolean(conflictItem);

  const handleSetNextOrder = () => {
    onChange(set(nextRecommended));
  };

  return (
    <Stack space={3}>
      {/* Default Sanity Number Input Field */}
      {renderDefault(props)}

      {/* Real-time Order Insight Helper Box */}
      <Card
        padding={3}
        radius={2}
        tone={isCurrentUsed ? 'caution' : 'primary'}
        border
        style={{ marginTop: '4px' }}
      >
        <Stack space={3}>
          {/* Status Header */}
          <Flex align="center" justify="space-between" wrap="wrap" gap={2}>
            <Flex align="center" gap={2}>
              <Text size={1} weight="semibold">
                Order Status:
              </Text>
              {loading ? (
                <Badge tone="default">Checking...</Badge>
              ) : isCurrentUsed ? (
                <Badge tone="caution" padding={2}>
                  ⚠️ Already in use by: &quot;{conflictItem.title || 'Untitled'}&quot;
                </Badge>
              ) : currentOrderNum !== undefined ? (
                <Badge tone="positive" padding={2}>
                  ✓ Order {currentOrderNum} is available
                </Badge>
              ) : (
                <Badge tone="default">No order specified</Badge>
              )}
            </Flex>

            {!loading && nextRecommended !== currentOrderNum && (
              <Button
                fontSize={1}
                padding={2}
                mode="ghost"
                tone="positive"
                text={`Use Next Available (${nextRecommended})`}
                onClick={handleSetNextOrder}
              />
            )}
          </Flex>

          {/* Quick Summary Info */}
          <Flex align="center" gap={4} wrap="wrap">
            <Text size={1} muted>
              Total other {docType === 'upcomingTool' ? 'upcoming tools' : 'tools'}:{' '}
              <strong>{existingItems.length}</strong>
            </Text>
            <Text size={1} muted>
              Highest order used:{' '}
              <strong>{maxOrder >= 0 ? maxOrder : 'None'}</strong>
            </Text>
            <Text size={1} muted>
              Next suggested: <strong>{nextRecommended}</strong>
            </Text>
          </Flex>

          {/* List of currently assigned orders */}
          {existingItems.length > 0 && (
            <Box style={{ maxHeight: '120px', overflowY: 'auto', paddingTop: '4px' }}>
              <Text size={0} weight="semibold" muted style={{ marginBottom: '6px', display: 'block' }}>
                Currently assigned order numbers:
              </Text>
              <Flex wrap="wrap" gap={1}>
                {existingItems.map((item) => {
                  const isConflict = item.order === currentOrderNum;
                  return (
                    <Badge
                      key={item._id}
                      tone={isConflict ? 'caution' : 'default'}
                      title={`${item.title || 'Untitled'} (Order ${item.order})`}
                      style={{ cursor: 'help' }}
                    >
                      #{item.order}: {item.title ? (item.title.length > 18 ? item.title.slice(0, 18) + '...' : item.title) : 'Untitled'}
                    </Badge>
                  );
                })}
              </Flex>
            </Box>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
