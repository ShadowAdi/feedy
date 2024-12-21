"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { FeedbackProps, tableColumns } from "@/lib/types";
import { GetAllFeedbacks } from "@/lib/appWriteHandlers";
import { useToast } from "@/hooks/use-toast";
import { Snippet } from "@nextui-org/snippet";

const TableData = ({
  projectId,
  tableLabel,
}: {
  projectId: string;
  tableLabel: string;
}) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackProps[]>([]);
  const { toast } = useToast();
  const getFeedbacks = async () => {
    try {
      const { success, feedbacks } = await GetAllFeedbacks(projectId);
      if (!success) {
        setFeedbackData([]);
        toast({
          title: "Failed to get feedbacks",
          variant: "destructive",
        });
      }
      if (feedbacks) {
        setFeedbackData(feedbacks);
      } else {
        setFeedbackData([]);
      }
    } catch (error) {
      toast({
        title: "Failed to get feedbacks",
        description: `${error}`,
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    getFeedbacks();
  }, [projectId]);

  if (feedbackData.length === 0) {
    return (
      <Table className="bg-[#ffffff]" aria-label={tableLabel}>
        <TableHeader className="bg-[#dfdede]" columns={tableColumns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          className="bg-[#dfdede]"
          emptyContent={"No rows to display."}
        >
          {[]}
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="flex-col flex gap-3 w-full">
      <h5 className="text-lg font-medium">Total Feedbacks- {feedbackData.length}</h5>
      <Table className="bg-[#ffffff]" aria-label={tableLabel}>
        <TableHeader className="capitalize" columns={tableColumns}>
          {(column) => (
            <TableColumn className="capitalize" key={column.key}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody items={feedbackData}>
          {(item) => {
            return (
              <TableRow className="capitalize" key={item.$id}>
                {(columnKey) => {
                  if (columnKey === "page_url") {
                    return (
                      <TableCell>
                        <Snippet>{getKeyValue(item, columnKey)}</Snippet>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell className=" ">
                      {getKeyValue(item, columnKey)}
                    </TableCell>
                  );
                }}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableData;
