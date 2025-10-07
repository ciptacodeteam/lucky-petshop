"use client";
import { DeleteBankAccountButton } from "@/components/forms/bankAccounts/DeleteBankAccountButton";
import EditBankAccountForm from "@/components/forms/bankAccounts/EditBankAccountForm";
import Modal from "@/components/modals/Modal";
import { Button } from "@/components/ui/button";
import type { TransferBank } from "@prisma/client";
import { IconPencil } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const colHelper = createColumnHelper<TransferBank>();
export const bankAccountColumn = [
  colHelper.accessor("id", {
    header: "No",
    meta: {
      width: 80,
    },
    cell: (info) => info.row.index + 1,
  }),
  colHelper.accessor("name", {
    header: "Nama Bank",
    cell: (info) => info.getValue(),
  }),
  colHelper.accessor("accountNumber", {
    header: "Nomor Rekening",
    cell: (info) => (
      <div className="flex items-center justify-center gap-2">
        <span className="font-mono tracking-widest">{info.getValue()}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => {
                navigator.clipboard.writeText(info.getValue());
                toast.success("Nomor rekening disalin ke clipboard");
              }}
            >
              <CopyIcon className="size-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Salin</span>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
  }),
  colHelper.accessor("accountHolder", {
    header: "Nama Pemegang Rekening",
    cell: (info) => info.getValue(),
  }),
  colHelper.accessor("createdAt", {
    header: "Dibuat Pada",
    cell: (info) => dayjs(info.getValue()).format("DD MMM YYYY"),
  }),
  colHelper.display({
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Modal
          triggerChildren={
            <Button variant={"secondary"} size={"icon"}>
              <IconPencil className="!size-4" />
            </Button>
          }
          title="Edit Bank Account"
          description="Form untuk mengedit bank account"
        >
          <EditBankAccountForm id={row.original.id} />
        </Modal>
        <DeleteBankAccountButton id={row.original.id} />
      </div>
    ),
  }),
];
