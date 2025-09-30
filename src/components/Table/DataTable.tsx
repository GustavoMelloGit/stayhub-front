import type { DataTableProps, JsonDataTableRow } from './types';
import { DataTableDesktop } from './DataTableDesktop';
import { DataTableMobile } from './DataTableMobile';

export function DataTable<T extends JsonDataTableRow>(
  props: DataTableProps<T>
) {
  return (
    <>
      <div className='hidden md:block'>
        <DataTableDesktop {...props} />
      </div>
      <div className='block md:hidden'>
        <DataTableMobile {...props} />
      </div>
    </>
  );
}
