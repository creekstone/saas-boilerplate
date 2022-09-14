import { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { RoutesConfig } from '../../../app/config/routes';
import { useTransactionHistory } from '../../../shared/components/finances/stripe/transactionHistory/transactionHistory.hooks';
import { useGenerateLocalePath } from '../../../shared/hooks/localePaths';
import { useActiveSubscriptionDetailsQueryRef } from '../activeSubscriptionContext/activeSubscriptionContext.hooks';
import { Container, Header, Link, Row, Section, Subheader } from './subscriptions.styles';
import { SubscriptionsContent } from './subscriptions.content';
import { PaymentMethodContent } from './paymentMethod.content';

export const Subscriptions = () => {
  const generateLocalePath = useGenerateLocalePath();

  const transactionsHistory = useTransactionHistory();
  const activeSubscriptionDetailsQueryRefContext = useActiveSubscriptionDetailsQueryRef();

  return (
    <Container>
      <Section>
        <Header>
          <FormattedMessage defaultMessage="Subscriptions" id="My subscription / Header" />
        </Header>

        {activeSubscriptionDetailsQueryRefContext && activeSubscriptionDetailsQueryRefContext.ref && (
          <Suspense fallback={null}>
            <SubscriptionsContent activeSubscriptionQueryRef={activeSubscriptionDetailsQueryRefContext.ref} />
          </Suspense>
        )}
      </Section>

      <Section>
        <Header>
          <FormattedMessage defaultMessage="Payments" id="My subscription / Payments header" />
        </Header>

        <Subheader>
          <FormattedMessage defaultMessage="Payment method" id="My subscription / Payment method header" />
        </Subheader>

        {activeSubscriptionDetailsQueryRefContext && activeSubscriptionDetailsQueryRefContext.ref && (
          <Suspense fallback={null}>
            <PaymentMethodContent activeSubscriptionQueryRef={activeSubscriptionDetailsQueryRefContext.ref} />
          </Suspense>
        )}
      </Section>

      <Section>
        <Header>
          <FormattedMessage defaultMessage="History" id="My subscription / History header" />
        </Header>

        {transactionsHistory.length > 0 ? (
          <Link to={generateLocalePath(RoutesConfig.finances.history)}>
            <FormattedMessage defaultMessage="View transaction history" id="My subscription / View history button" />
          </Link>
        ) : (
          <Row>
            <FormattedMessage
              defaultMessage="You don't have any history to show"
              id="My subscription / No transaction history"
            />
          </Row>
        )}
      </Section>
    </Container>
  );
};
