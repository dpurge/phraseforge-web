import DocSidebarItems from '@theme-original/DocSidebarItems';
import type DocSidebarItemsType from '@theme/DocSidebarItems';
import type {WrapperProps} from '@docusaurus/types';

import LanguagePicker from '@site/src/components/LanguagePicker';

type Props = WrapperProps<typeof DocSidebarItemsType>;

export default function DocSidebarItemsWrapper(props: Props) {
  return (
    <>
      {props.level === 1 && <LanguagePicker />}
      <DocSidebarItems {...props} />
    </>
  );
}
