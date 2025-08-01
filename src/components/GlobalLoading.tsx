import * as Dialog from '@radix-ui/react-dialog';

export default function GlobalLoading({ open = false }: { open: boolean }) {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#FFA200]" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
